import {IconDefinition, IconPack} from '@fortawesome/fontawesome-common-types';
import {dom, library} from '@fortawesome/fontawesome-svg-core';

import {definition as falSitemap} from '@fortawesome/free-solid-svg-icons/faSitemap';

import {definition as farArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import {definition as farArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import {definition as farBars, definition as faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {definition as farBug, definition as faBug} from '@fortawesome/free-solid-svg-icons/faBug';
import {definition as farCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import {definition as farCheckCircle} from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import {definition as farChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import {definition as farClock, definition as faClock} from '@fortawesome/free-regular-svg-icons/faClock';
import {definition as farExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import {definition as farExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {definition as farFrown, definition as faFrown} from '@fortawesome/free-regular-svg-icons/faFrown';
import {definition as farHome, definition as faHome} from '@fortawesome/free-solid-svg-icons/faHome';
import {definition as farInfoCircle, definition as faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {definition as farMinus, definition as faMinus} from '@fortawesome/free-solid-svg-icons/faMinus';
import {definition as farPlus, definition as faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {definition as farPlusCircle} from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import {definition as farSave} from '@fortawesome/free-regular-svg-icons/faSave';
import {definition as farSearch, definition as faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import {definition as farSpinner, definition as faSpinner} from '@fortawesome/free-solid-svg-icons/faSpinner';
import {definition as farTable, definition as faTable} from '@fortawesome/free-solid-svg-icons/faTable';
import {definition as farTimes, definition as faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {definition as farTimesCircle} from '@fortawesome/free-regular-svg-icons/faTimesCircle';

export type IconDefinitionOrPack = IconDefinition | IconPack;

export default class BaseFontAwesomeBuilder {
  static buildLibrary(...appIcons: IconDefinitionOrPack[]) {
    library.add(
      falSitemap,

      farArrowLeft,
      farArrowRight,
      farBars,
      farBug,
      farCheck,
      farCheckCircle,
      farChevronRight,
      farClock,
      farExclamationTriangle,
      farExternalLinkAlt,
      farFrown,
      farHome,
      farInfoCircle,
      farMinus,
      farPlus,
      farPlusCircle,
      farSave,
      farSearch,
      farSpinner,
      farTable,
      farTimes,
      farTimesCircle,

      faBars,
      faBug,
      faClock,
      faFrown,
      faHome,
      faInfoCircle,
      faMinus,
      faPlus,
      faSearch,
      faSpinner,
      faTimes,
      faTable,
    );

    appIcons.forEach(x => library.add(x));

    dom.watch();
  }
}
