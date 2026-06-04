# Generates premium GLB assets for the Velvet Letter R3F scene.
# Run headless:
#   "<blender>" --background --python blender/build_assets.py
# Outputs (overwrites): public/models/rose.glb, vl-mark.glb, filigree.glb
#
# Design intent:
#   rose      — layered, curled, cupped petals in a phyllotaxis spiral with
#               organic per-petal variation (no obvious radial repeat). One merged
#               mesh, smooth-shaded, solidified for real thickness. Used as the
#               instanced rose geometry in the hero (replaces displaced icosahedra).
#   vl-mark   — bevelled, extruded serif "VL" (Georgia) for the wax-seal emboss
#               (replaces flat drei <Text>). Real dimensional lettering.
#   filigree  — beaded double-hairline gold ring (replaces the plain torus): a
#               core torus + concentric hairline + ring of beads = jewelry, not a donut.

import bpy
import bmesh
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "models")
os.makedirs(OUT, exist_ok=True)


# Deterministic PRNG so re-runs are identical (no Blender frame/seed drift).
def make_rng(seed):
    state = {"a": seed & 0xFFFFFFFF}

    def rng():
        a = state["a"]
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        state["a"] = a
        t = (a ^ (a >> 15)) * (1 | a) & 0xFFFFFFFF
        t = (t + ((t ^ (t >> 7)) * (61 | t) & 0xFFFFFFFF)) & 0xFFFFFFFF ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296.0

    return rng


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    if bpy.context.selected_objects:
        bpy.ops.object.delete()
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.curves, bpy.data.fonts):
        for b in list(coll):
            if b.users == 0:
                coll.remove(b)


def principled(name, color, roughness, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def normalize_and_center(obj, target_max=1.0):
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.location = (0, 0, 0)
    dims = obj.dimensions
    m = max(dims.x, dims.y, dims.z) or 1.0
    s = target_max / m
    obj.scale = (s, s, s)
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=True)


def export_glb(obj, filename):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    path = os.path.join(OUT, filename)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
    )
    print("EXPORTED", path)


# ----------------------------------------------------------------------------
# ROSE — layered curled petals
# ----------------------------------------------------------------------------
def build_petal(bm, mat_offset, length, width, cup, curl, base_pinch):
    nu, nv = 7, 10  # across, along
    grid = [[None] * nv for _ in range(nu)]
    for i in range(nu):
        u = i / (nu - 1) - 0.5  # -0.5..0.5 across
        for j in range(nv):
            v = j / (nv - 1)  # 0 base -> 1 tip
            # petal silhouette: pinched at base, widest mid, rounded tip
            wprof = math.sin(math.pi * (base_pinch + (1 - base_pinch) * v))
            x = u * width * wprof
            y = v * length
            # cup across the width (taco fold), stronger toward base
            z = -cup * (u * u) * (1.2 - 0.6 * v)
            # curl the tip back outward
            z += curl * (v ** 2.4)
            grid[i][j] = bm.verts.new((x, y, z))
    faces = []
    for i in range(nu - 1):
        for j in range(nv - 1):
            faces.append(
                bm.faces.new([grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]])
            )
    return faces


def build_rose():
    clear_scene()
    rng = make_rng(20260601)
    bm = bmesh.new()

    # Phyllotaxis-ish layers: more petals + larger + more open as we go outward.
    layers = [
        # (count, radius, length, width, tilt_deg, cup, curl, scale)
        (1, 0.00, 0.34, 0.30, 88, 0.55, 0.05, 0.9),   # bud core
        (3, 0.06, 0.46, 0.40, 70, 0.5, 0.1, 1.0),
        (5, 0.13, 0.62, 0.52, 55, 0.42, 0.16, 1.05),
        (6, 0.22, 0.78, 0.64, 42, 0.34, 0.24, 1.1),
        (7, 0.32, 0.92, 0.74, 30, 0.26, 0.34, 1.12),
        (8, 0.42, 1.02, 0.82, 20, 0.2, 0.44, 1.12),
    ]

    for (count, radius, length, width, tilt, cup, curl, lscale) in layers:
        ang0 = rng() * math.tau
        for k in range(count):
            a = ang0 + (k / count) * math.tau + (rng() - 0.5) * 0.5
            # per-petal organic variation
            jl = length * lscale * (0.88 + rng() * 0.24)
            jw = width * lscale * (0.88 + rng() * 0.24)
            jcup = cup * (0.85 + rng() * 0.3)
            jcurl = curl * (0.7 + rng() * 0.6)
            jtilt = math.radians(tilt + (rng() - 0.5) * 16)

            verts_before = len(bm.verts)
            build_petal(bm, 0, jl, jw, jcup, jcurl, 0.18 + rng() * 0.1)
            new_verts = bm.verts[verts_before:]

            # orient: petal grows along +Y from origin; tilt up around X, then
            # rotate around Z to its slot, then push out by radius.
            import mathutils
            rotx = mathutils.Matrix.Rotation(math.pi / 2 - jtilt, 4, "X")
            rotz = mathutils.Matrix.Rotation(a, 4, "Z")
            offset = mathutils.Vector(
                (math.cos(a) * radius, math.sin(a) * radius, radius * 0.15)
            )
            mat = rotz @ rotx
            for vrt in new_verts:
                vrt.co = mat @ vrt.co + offset

    mesh = bpy.data.meshes.new("RoseMesh")
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new("Rose", mesh)
    bpy.context.collection.objects.link(obj)

    # Solidify for real petal thickness, smooth shading.
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    solid = obj.modifiers.new("Solidify", "SOLIDIFY")
    solid.thickness = 0.012
    solid.offset = 0
    bpy.ops.object.modifier_apply(modifier=solid.name)
    bpy.ops.object.shade_smooth()
    mesh.materials.append(principled("RosePetal", (0.46, 0.18, 0.2), 0.62))

    normalize_and_center(obj, target_max=1.0)
    export_glb(obj, "rose.glb")


# ----------------------------------------------------------------------------
# VL MARK — bevelled extruded serif lettering
# ----------------------------------------------------------------------------
def build_vl_mark():
    clear_scene()
    bpy.ops.object.text_add()
    txt = bpy.context.active_object
    txt.data.body = "VL"
    for font_path in (
        "C:/Windows/Fonts/georgiab.ttf",
        "C:/Windows/Fonts/georgia.ttf",
        "C:/Windows/Fonts/timesbd.ttf",
    ):
        if os.path.exists(font_path):
            txt.data.font = bpy.data.fonts.load(font_path)
            break
    txt.data.align_x = "CENTER"
    txt.data.align_y = "CENTER"
    txt.data.size = 1.0
    txt.data.extrude = 0.09
    txt.data.bevel_depth = 0.012
    txt.data.bevel_resolution = 2
    txt.data.space_character = 1.0
    bpy.ops.object.convert(target="MESH")
    obj = bpy.context.active_object
    bpy.ops.object.shade_smooth()
    # auto-smooth so the bevel reads round but the flat faces stay crisp
    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.materials.append(principled("SealMark", (0.42, 0.16, 0.16), 0.45))
    normalize_and_center(obj, target_max=1.0)
    export_glb(obj, "vl-mark.glb")


# ----------------------------------------------------------------------------
# FILIGREE — beaded double-hairline gold ring
# ----------------------------------------------------------------------------
def build_filigree():
    clear_scene()
    rng = make_rng(7)
    parts = []

    # Core torus
    bpy.ops.mesh.primitive_torus_add(
        major_radius=1.0, minor_radius=0.05, major_segments=128, minor_segments=14
    )
    core = bpy.context.active_object
    parts.append(core)

    # Inner hairline torus
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.82, minor_radius=0.018, major_segments=96, minor_segments=10
    )
    parts.append(bpy.context.active_object)

    # Ring of beads riding the core
    beads = 44
    for k in range(beads):
        a = (k / beads) * math.tau
        r = 1.0
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=0.052 * (0.9 + rng() * 0.2), segments=12, ring_count=8,
            location=(math.cos(a) * r, math.sin(a) * r, 0),
        )
        parts.append(bpy.context.active_object)

    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = core
    bpy.ops.object.join()
    ring = bpy.context.active_object
    bpy.ops.object.shade_smooth()
    ring.data.materials.append(principled("Filigree", (0.79, 0.66, 0.30), 0.28, metallic=1.0))
    normalize_and_center(ring, target_max=1.0)
    export_glb(ring, "filigree.glb")


if __name__ == "__main__":
    build_rose()
    build_vl_mark()
    build_filigree()
    print("ALL ASSETS BUILT")
