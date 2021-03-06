'use strict';

/* global bootstrapModeler, inject */

var Matchers = require('../../../Matchers'),
    TestHelper = require('../../../TestHelper');

var modelingModule = require('../../../../lib/features/modeling'),
    coreModule = require('../../../../lib/core');


describe('features/modeling - #removeConnection', function() {

  beforeEach(Matchers.addDeepEquals);


  var diagramXML = require('../../../fixtures/bpmn/sequence-flows.bpmn');

  var testModules = [ coreModule, modelingModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('shape handling', function() {

    it('should execute', inject(function(elementRegistry, modeling) {

      // given
      var sequenceFlowShape = elementRegistry.get('SequenceFlow_2'),
          sequenceFlow = sequenceFlowShape.businessObject;

      // when
      modeling.removeConnection(sequenceFlowShape);

      // then
      expect(sequenceFlow.$parent).toBeNull();
    }));
  });


  describe('undo support', function() {

    it('should undo', inject(function(elementRegistry, modeling, commandStack) {

      // given
      var sequenceFlowShape = elementRegistry.get('SequenceFlow_2'),
          sequenceFlow = sequenceFlowShape.businessObject,
          parent = sequenceFlow.$parent;

      // when
      modeling.removeConnection(sequenceFlowShape);
      commandStack.undo();

      // then
      expect(sequenceFlow.$parent).toBe(parent);
    }));
  });


  describe('redo support', function() {

    it('redo', inject(function(elementRegistry, modeling, commandStack) {

      // given
      var sequenceFlowShape = elementRegistry.get('SequenceFlow_2'),
          sequenceFlow = sequenceFlowShape.businessObject;

      // when
      modeling.removeConnection(sequenceFlowShape);
      commandStack.undo();
      commandStack.redo();

      // then
      expect(sequenceFlow.$parent).toBeNull();
    }));
  });

});
