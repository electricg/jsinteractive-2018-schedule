import data from '../data/schedule';

import './schedule.scss';

const minSlot = 5 * 60;

const parseVenue = venue => venue.replace(/[\s\.]/g, '');

const getVenues = data => {
  const venues = data.reduce((acc, session) => {
    const { venue } = session;
    acc[venue] = true;
    return acc;
  }, {});

  const parsedVenue = Object.keys(venues).map(venue => parseVenue(venue));

  return parsedVenue;
};

const getTimes = (start, end) => {
  let arr = [];

  for (let i = start; i <= end; i += minSlot) {
    arr.push(i);
  }

  return arr;
};

const getSlots = (venues, times) => {
  return times
    .map(time => {
      return `"${venues
        .map(venue => {
          return `t${time}_${venue}`;
        })
        .join(' ')}"`;
    })
    .join(' ');
};

const Session = ({ session = {} }) => {
  const { name, venue, time_compiled: time } = session;
  const [
    startInt,
    endInt,
    month,
    day,
    year,
    dayName,
    startDate,
    startHour,
    endHour,
  ] = time.split('|');
  const parsedVenue = parseVenue(venue);
  const startId = `t${startInt}_${parsedVenue}`;
  const endId = `t${endInt - minSlot}_${parsedVenue}`;

  return (
    <section
      className={`session ${parsedVenue}`}
      style={{ '--grid-area-start': startId, '--grid-area-end': endId }}
    >
      <div className="session__name">{name}</div>
      {/* <div className="session__venue">{venue}</div> */}
      {/* <div className="session__time">{time}</div> */}
    </section>
  );
};

const Schedule = () => {
  // console.log(data);
  const venues = getVenues(data);
  const times = getTimes(1539176400, 1539475200);
  const s = getSlots(venues, times);
  const h = venues.join(' ');
  console.log(venues.length);

  return (
    <div
      className="schedule"
      style={{
        'grid-template-columns': `repeat(${venues.length}, 1fr)`,
        'grid-template-rows': `repeat(${times.length + 1}, 0.1fr)`,
        'grid-template-areas': `"${h}" ${s}`,
      }}
    >
      {venues.map(venue => (
        <section
          className={`session-header ${venue}`}
          key={venue}
          style={{ '--grid-area-start': `${venue}` }}
        >
          {venue}
        </section>
      ))}
      {data.map(session => (
        <Session key={session.id} session={session} />
      ))}
    </div>
  );
};

export default Schedule;
