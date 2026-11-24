import { Link } from 'react-router-dom';

type CTA = { label: string; to: string };

type Props = {
  eyebrow: string;
  heading: string;
  body?: string;
  primary: CTA;
  secondary?: CTA;
  /** `paper` closes a bone page (band is pine); `room` closes a pine page (band is pine-mid). */
  stock?: 'paper' | 'room';
};

/**
 * The closing band of every inner page: back on the press-room floor, with the
 * calls to action set as sorts. Same vocabulary as the home's "run" section.
 */
export function PressBand({ eyebrow, heading, body, primary, secondary, stock = 'paper' }: Props) {
  return (
    <section className={`press-run ${stock === 'room' ? 'press-run--room' : ''}`}>
      <p className="press-folio press-folio--brass">{eyebrow}</p>
      <h2 className="press-run__heading">{heading}</h2>
      {body && <p className="press-run__body">{body}</p>}
      <div className="press-run__actions">
        <Link to={primary.to} className="sort-btn">
          {primary.label}
        </Link>
        {secondary && (
          <Link to={secondary.to} className="sort-btn sort-btn--lead">
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}
