import {ListGroup} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import DayJs from '../utils/dayjs';


/**
 * @enum {string}
 */
export const FilterBy = {
  ALL: '',
  IMPORTANT: 'IMPORTANT',
  TODAY: 'TODAY',
  NEXT_7_DAYS: 'NEXT_7_DAYS',
  PRIVATE: 'PRIVATE',
};

const today = DayJs()
  .hour(0)
  .minute(0)
  .millisecond(0);

/**
 * @callback FilterFn
 * @param {Task} task
 * @return {boolean}
 * @type {Object.<FilterBy, FilterFn>}
 */
export const filterFns = {
  [FilterBy.ALL]: task => task,
  [FilterBy.IMPORTANT]: task => task.important === true,
  [FilterBy.TODAY]: task => task.deadline?.isToday(),
  [FilterBy.NEXT_7_DAYS]: task => task.deadline?.isBetween(today, DayJs(today).add(7, 'day')),
  [FilterBy.PRIVATE]: task => task.private === true,
};

/**
 * @type {Object.<FilterBy, string>}
 */
export const filterTitles = {
  [FilterBy.ALL]: 'All',
  [FilterBy.IMPORTANT]: 'Important',
  [FilterBy.TODAY]: 'Today',
  [FilterBy.NEXT_7_DAYS]: 'Next 7 Days',
  [FilterBy.PRIVATE]: 'Private',
};

export default function Filters() {
  return (
    <ListGroup variant="flush">
      {
        Object.values(FilterBy)
          .map(filterByKey => (
                <ListGroup.Item as={NavLink} to={`/${filterByKey}`} key={filterByKey} action exact >
                  {filterTitles[filterByKey]}
                </ListGroup.Item>
            )
          )
      }
    </ListGroup>
  );
}
