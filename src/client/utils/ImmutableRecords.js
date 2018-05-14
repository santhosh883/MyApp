import { Map, fromJS as originalFromJS } from 'immutable';

import CustomScoringModel from '../models/CustomScoringModel.jsx';
import Datapoint from '../models/Datapoint.jsx';
import Pillar from '../models/Pillar.jsx';

export const fromJS = any => originalFromJS(any);

const knownRecordTypes = new Map({
  CustomScoringModel,
  Datapoint,
  Pillar,
});

/*
 * By default, ensure deep conversion with fromJS() and then invoke Record constructor.
 * E.g.
    import { fromJS } from 'relative/path/to/utils/ImmutableUtils.js';
    ajaxGET('/rest/custom_scoring/:id').then(fromJS.CustomScoringModel); // => Promise<CustomScoringModel>
    ajaxGET('/rest/custom_scoring').then(fromJS.CustomScoringModel); // => Promise<List<CustomScoringModel>>
    fromJS.CustomScoringModel(JSON.parse(localStorage.lastEditedCustomScoringModel)); // => CustomScoringModel
 *
 * See this article: https://gist.github.com/jareware/5f492d47fae45d577e922c431c267c67
 */
knownRecordTypes.forEach((Type, name) => (fromJS[name] = any => new Type(fromJS(any))));
