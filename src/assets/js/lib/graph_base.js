
var _ = require('lodash');


import {GraphConfig } from './base/config'
import {GraphBaseFunc } from './base/base_func'
import {GraphCommonFunc} from './base/common'


const GraphBase = {};
// Graph Object
_.assignIn(GraphBase, GraphConfig, GraphBaseFunc,GraphCommonFunc);

export {GraphBase}