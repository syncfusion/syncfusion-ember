/**
* @fileOverview Plugin to style the Html Button elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej) {
    "use strict";
    ej.datavisualization.Diagram.BasicShapes = {
        Rectangle: "rectangle",
        Ellipse: "ellipse",
        Path: "path",
        Polygon: "polygon",
        Triangle: "triangle",
        Plus: "plus",
        Star: "star",
        Pentagon: "pentagon",
        Heptagon: "heptagon",
        Octagon: "octagon",
        Trapezoid: "trapezoid",
        Decagon: "decagon",
        RightTriangle: "righttriangle",
        Cylinder: "cylinder"
    };
    ej.datavisualization.Diagram.FlowShapes = {
        Process: "process",
        Decision: "decision",
        Document: "document",
        PreDefinedProcess: "predefinedprocess",
        Terminator: "terminator",
        PaperTap: "papertap",
        DirectData: "directdata",
        SequentialData: "sequentialdata",
        Sort: "sort",
        MultiDocument: "multidocument",
        Collate: "collate",
        SummingJunction: "summingjunction",
        Or: "or",
        InternalStorage: "internalstorage",
        Extract: "extract",
        ManualOperation: "manualoperation",
        Merge: "merge",
        OffPageReference: "offpagereference",
        SequentialAccessStorage: "sequentialaccessstorage",
        Annotation1: "annotation1",
        Annotation2: "annotation2",
        Data: "data",
        Card: "card"
    };
    ej.datavisualization.Diagram.ArrowShapes = {
        None: "none",
        CircularArrow: "circulararrow",
        CurvedRightArrow: "curvedrightarrow",
        CurvedUpArrow: "curveduparrow",
        CurvedLeftArrow: "curvedleftarrow",
        CurvedDownArrow: "curveddownarrow",
        JumpingRightArrow: "jumpingrightarrow",
        JumpingLeftArrow: "jumpingleftarrow"
    };
    ej.datavisualization.Diagram.BPMNShapes = {
        Event: "event",
        Gateway: "gateway",
        Message: "message",
        DataObject: "dataobject",
        DataSource: "datasource",
        Activity: "activity",
        Group: "group"
    };

    ej.datavisualization.Diagram.BPMNEvents = {
        Start: "start",
        Intermediate: "intermediate",
        End: "end",
        NonInterruptingStart: "noninterruptingstart",
        NonInterruptingIntermediate: "noninterruptingintermediate",
        ThrowingIntermediate: "throwingintermediate"
    };

    ej.datavisualization.Diagram.BPMNTriggers = {
        None: "none",
        Message: "message",
        Timer: "timer",
        Escalation: "escalation",
        Link: "link",
        Error: "error",
        Compensation: "compensation",
        Signal: "signal",
        Multiple: "multiple",
        Parallel: "parallel",
        Cancel: "cancel",
        Conditional: "conditional",
        Terminate: "terminate"
    };

    ej.datavisualization.Diagram.BPMNGateways = {
        None: "none",
        Exclusive: "exclusive",
        Inclusive: "inclusive",
        Parallel: "parallel",
        Complex: "complex",
        EventBased: "eventbased",
        ExclusiveEventBased: "exclusiveeventbased",
        ParallelEventBased: "paralleleventbased",
    };

    ej.datavisualization.Diagram.BPMNDataObjects = {
        None: "none",
        Input: "input",
        Output: "output",
    };

    ej.datavisualization.Diagram.BPMNActivity = {
        None: "none",
        Task: "task",
        SubProcess: "subprocess",
    };

    ej.datavisualization.Diagram.BPMNLoops = {
        None: "none",
        Standard: "standard",
        ParallelMultiInstance: "parallelmultiinstance",
        SequenceMultiInstance: "sequencemultiinstance"
    };
    ej.datavisualization.Diagram.BPMNTasks = {
        None: "none",
        Service: "service",
        Receive: "receive",
        Send: "send",
        InstantiatingReceive: "instantiatingreceive",
        Manual: "manual",
        BusinessRule: "businessrule",
        User: "user",
        Script: "script",
        Parallel: "parallel",
    };

    ej.datavisualization.Diagram.BPMNSubProcessTypes = {
        None: "none",
        Transaction: "transaction",
        Event: "event"
    };

    ej.datavisualization.Diagram.BPMNBoundary = {
        Default: "default",
        Call: "call",
        Event: "event",
    };
    ej.datavisualization.Diagram.BPMNAnnotationDirections = {
        Top: "top",
        Left: "left",
        Right: "right",
        Bottom: "bottom"
    };
    ej.datavisualization.Diagram.BPMNFlows = {
        Sequence: "sequence",
        Association: "association",
        Message: "message"
    };
    ej.datavisualization.Diagram.BPMNSequenceFlows = {
        Normal: "normal",
        Conditional: "conditional",
        Default: "default"
    };
    ej.datavisualization.Diagram.BPMNMessageFlows = {
        Default: "default",
        InitiatingMessage: "initiatingmessage",
        NonInitiatingMessage: "noninitiatingmessage"
    };
    ej.datavisualization.Diagram.ClassifierShapes = {
        Package: "package",
        Class: "class",
        Interface: "interface",
        Enumeration: "enumeration",
        CollapsedPackage: "collapsedpackage",
        Inheritance: "inheritance",
        Association: "association",
        Aggregation: "aggregation",
        Composition: "composition",
        Realization: "realization",
        DirectedAssociation: "directedassociation",
        Dependency: "dependency"
    };
    ej.datavisualization.Diagram.AssociationFlows = {
        Default: "default",
        Directional: "directional",
        BiDirectional: "bidirectional"
    };
    ej.datavisualization.Diagram.UMLActivityShapes = {
        Action: "action",
        Decision: "decision",
        MergeNode: "mergenode",
        InitialNode: "initialnode",
        FinalNode: "finalnode",
        ForkNode: "forknode",
        JoinNode: "joinnode",
        TimeEvent: "timeevent",
        AcceptingEvent: "acceptingevent",
        SendSignal: "sendsignal",
        ReceiveSignal: "receivesignal",
        StructuredNode: "structurednode",
        Note: "note"
    };
    ej.datavisualization.Diagram.UMLActivityFlow = {
        Object: "object",
        Control: "control",
        Exception: "exception"
    };
    ej.datavisualization.Diagram.BPMNEventDefaults = {
        event: ej.datavisualization.Diagram.BPMNEvents.Start,
        trigger: ej.datavisualization.Diagram.BPMNTriggers.None,
        name: null,
        offset: ej.datavisualization.Diagram.Point(),
        ports: [],
        labels: []
    };
    ej.datavisualization.Diagram.BPMNGatewayDefaults = {
        gateway: ej.datavisualization.Diagram.BPMNGateways.None,
    };
    ej.datavisualization.Diagram.BPMNDataObject = function (options) {
        return $.extend(false, {}, { type: ej.datavisualization.Diagram.BPMNDataObjects.None, collection: false }, options);
    };
    ej.datavisualization.Diagram.BPMNDataObjectDefaults = {
        data: ej.datavisualization.Diagram.BPMNDataObject()
    };
    ej.datavisualization.Diagram.BPMNTaskDefaults = {
        loop: ej.datavisualization.Diagram.BPMNLoops.None,
        type: ej.datavisualization.Diagram.BPMNTasks.None,
        call: false,
        compensation: false,
        events: []
    };
    ej.datavisualization.Diagram.BPMNTask = function (options) {
        if (options)
            options.events = options.events ? options.events.slice() : [];
        return $.extend(false, {}, ej.datavisualization.Diagram.BPMNTaskDefaults, options);
    };
    ej.datavisualization.Diagram.BPMNSubProcessDefaults = {
        type: ej.datavisualization.Diagram.BPMNSubProcessTypes.None,
        event: ej.datavisualization.Diagram.BPMNEvents.Start,
        trigger: ej.datavisualization.Diagram.BPMNTriggers.Message,
        boundary: ej.datavisualization.Diagram.BPMNBoundary.Default,
        loop: ej.datavisualization.Diagram.BPMNLoops.None,
        adhoc: false,
        compensation: false,
        collapsed: true,
        events: [],
        processes: []
    };
    ej.datavisualization.Diagram.BPMNSubProcess = function (options) {
        options = options || {};
        options.events = options.events ? options.events.slice() : [];
        options.processes = options.processes ? options.processes.slice() : [];
        return $.extend(false, {}, ej.datavisualization.Diagram.BPMNSubProcessDefaults, options);
    };
    ej.datavisualization.Diagram.BPMNActivityDefaults = {
        activity: ej.datavisualization.Diagram.BPMNActivity.Task,
        task: ej.datavisualization.Diagram.BPMNTask(),
        subProcess: ej.datavisualization.Diagram.BPMNSubProcess(),
    };
    ej.datavisualization.Diagram.BPMNTextAnnotationDefaults = {
        annotation: {
            width: 20, height: 20, angle: 0, length: 0, text: "",
            direction: ej.datavisualization.Diagram.BPMNAnnotationDirections.Left,
        }
    };
    ej.datavisualization.Diagram.ConnectorShapeDefaults = {
        type: "bpmn",
        flow: ej.datavisualization.Diagram.BPMNFlows.Sequence,
        sequence: ej.datavisualization.Diagram.BPMNSequenceFlows.Normal,
        association: ej.datavisualization.Diagram.AssociationFlows.Default,
        message: ej.datavisualization.Diagram.BPMNMessageFlows.Default
    };
    ej.datavisualization.Diagram.Multiplicity = {
        OneToOne: "onetoone",
        OneToMany: "onetomany",
        ManyToOne: "manytoone",
        ManyToMany: "manytomany"
    };
    ej.datavisualization.Diagram.ClassifierMultiplicityDefault = {
        type: ej.datavisualization.Diagram.Multiplicity.OneToOne,
        source: {
            optional: true,
            lowerBounds: null,
            upperBounds: null
        },
        target: {
            optional: true,
            lowerBounds: null,
            upperBounds: null
        }
    };
    ej.datavisualization.Diagram.UMLActivityFlowDefaults = {
        type: "umlactivity",
        activityFlow: ej.datavisualization.Diagram.UMLActivityFlow.Control
    };
    ej.datavisualization.Diagram.AssociationDefaults = {
        type: "classifier",
        association: ej.datavisualization.Diagram.AssociationFlows.BiDirectional,
        multiplicity: ej.datavisualization.Diagram.ClassifierMultiplicityDefault
    };
    ej.datavisualization.Diagram.AggregationDefaults = {
        type: "classifier",
        multiplicity: ej.datavisualization.Diagram.ClassifierMultiplicityDefault
    };
    ej.datavisualization.Diagram.CompositionDefaults = {
        type: "classifier",
        multiplicity: ej.datavisualization.Diagram.ClassifierMultiplicityDefault
    };
    ej.datavisualization.Diagram.DependencyDefaults = {
        type: "classifier",
        multiplicity: ej.datavisualization.Diagram.ClassifierMultiplicityDefault
    };
    ej.datavisualization.Diagram.RealizationDefaults = {
        type: "classifier",
        multiplicity: ej.datavisualization.Diagram.ClassifierMultiplicityDefault
    };
    ej.datavisualization.Diagram.InheritanceDefaults = {
        type: "classifier",
        multiplicity: ej.datavisualization.Diagram.ClassifierMultiplicityDefault
    };
    ej.datavisualization.Diagram.ScopeValueDefaults = {
        Public: "public",
        Protected: "",
        Private: "",
        Package: ""
    };
    ej.datavisualization.Diagram.ClassMemberDefaults = {
        name: "",
        value: ""
    };
    ej.datavisualization.Diagram.ClassAttributeDefaults = {
        name: "",
        type: "",
        scope: ej.datavisualization.Diagram.ScopeValueDefaults.Public
    };
    ej.datavisualization.Diagram.ClassMethodsArgumentsDefault = {
        name: "",
        type: "",
    };
    ej.datavisualization.Diagram.ClassMethodsDefaults = {
        name: "",
        type: "",
        arguments: ej.datavisualization.Diagram.ClassMethodsArgumentsDefault,
        scope: ej.datavisualization.Diagram.ScopeValueDefaults.Public
    };
    ej.datavisualization.Diagram.ClassmethodArguments = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.ClassMethodsArgumentsDefault, options);
    };
    ej.datavisualization.Diagram.ClassMethod = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.ClassMethodsDefaults, options);
    };
    ej.datavisualization.Diagram.ClassMember = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.ClassMemberDefaults, options);
    };
    ej.datavisualization.Diagram.ClassAttribute = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.ClassAttributeDefaults, options);
    };
    ej.datavisualization.Diagram.ClassifierClass = function (options) {
        options.attributes = options.attributes ? options.attributes.slice() : [];
        options.methods = options.methods ? options.methods.slice() : [];
        return $.extend(false, {}, ej.datavisualization.Diagram.ClassDefaults, options);
    };
    ej.datavisualization.Diagram.ClassifierInterface = function (options) {
        options.attributes = options.attributes ? options.attributes.slice() : [];
        options.methods = options.methods ? options.methods.slice() : [];
        return $.extend(false, {}, ej.datavisualization.Diagram.InterfaceDefaults, options);
    };
    ej.datavisualization.Diagram.ClassifierEnumeration = function (options) {
        options.members = options.members ? options.members.slice() : [];
        return $.extend(false, {}, ej.datavisualization.Diagram.EnumerationDefaults, options);
    };
    ej.datavisualization.Diagram.UMLConnector = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.UMLConnectorDefaults, options);
    };
    ej.datavisualization.Diagram.UMLConnectorAssociation = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.AssociationDefaults, options);
    };
    ej.datavisualization.Diagram.UMLConnectorAggregation = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.AggregationDefaults, options);
    };
    ej.datavisualization.Diagram.UMLConnectorComposition = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.CompositionDefaults, options);
    };
    ej.datavisualization.Diagram.UMLConnectorDependency = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.DependencyDefaults, options);
    };
    ej.datavisualization.Diagram.UMLConnectorRealization = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.RealizationDefaults, options);
    };
    ej.datavisualization.Diagram.UMLConnectorInheritance = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.InheritanceDefaults, options);
    };
    ej.datavisualization.Diagram.UMLConnectorMultiplicity = function (options) {
        if (options.source) {
            options.source.optional = options.source.optional ? options.source.optional : true,
            options.source.lowerBounds = options.source.lowerBounds ? options.source.lowerBounds : null,
            options.source.upperBounds = options.source.upperBounds ? options.source.upperBounds : null
        }
        if (options.target) {
            options.target.optional = options.target.optional ? options.target.optional : true,
            options.target.lowerBounds = options.target.lowerBounds ? options.target.lowerBounds : null,
            options.target.upperBounds = options.target.upperBounds ? options.target.upperBounds : null

        }
        return $.extend(false, {}, ej.datavisualization.Diagram.ClassifierMultiplicityDefault, options);
    };
    ej.datavisualization.Diagram.UMLActivityFlow = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.UMLActivityFlowDefaults, options);
    }
    ej.datavisualization.Diagram.ClassDefaults = {
        name: " ",
        attributes: [
         ej.datavisualization.Diagram.ClassAttribute()
        ],
        methods: [
            ej.datavisualization.Diagram.ClassMethod()
        ]

    };
    ej.datavisualization.Diagram.InterfaceDefaults = {
        name: " ",
        attributes: [
            ej.datavisualization.Diagram.ClassAttribute()
        ],
        methods: [
            ej.datavisualization.Diagram.ClassMethod()
        ]
    };
    ej.datavisualization.Diagram.EnumerationDefaults = {
        name: " ",
        members: [
            ej.datavisualization.Diagram.ClassMember()
        ],
    };
    ej.datavisualization.Diagram.NodeType = function (options, diagram) {
        if (!options._isInternalShape) {
            var defaultType = diagram.model.defaultSettings && diagram.model.defaultSettings.node && diagram.model.defaultSettings.node.type ? diagram.model.defaultSettings.node.type : "";
            var nodeDefault = !options.isPhase && diagram.model.defaultSettings && diagram.model.defaultSettings.node ? diagram.model.defaultSettings.node : {};
            if (!options.type && !options.children && !options.isLane && !options.isSwimlane && !options.isPhase && !options.isPhaseStack) {
                if (options.segments || options.sourceNode || options.sourcePort || options.sourcePoint || options.targetNode || options.targetPort || options.targetPoint)
                    options.type = "connector";
                else
                    options.type = defaultType ? defaultType : "basic";
            }
            if (options.isSwimlane || options.type == "swimlane") options._type = "group";
            if (options.type == "basic" || options.type == "flow" || options.type == "arrow" || options.type == "bpmn" || options.type == "image" || options.type == "native" || options.type === "html" || options.type === "text" || options.type == "umlactivity") {
                if (!diagram._isLoad || (diagram._isLoad && !options._type))
                    options._type = "node";
                options = $.extend(true, {}, nodeDefault, options);
            }
            if (!diagram._isLoad || diagram.model.nodeTemplate || diagram._isOptimize) {
                if (options.type == "basic")
                    options = ej.datavisualization.Diagram.BasicShape(options);
                else if (options.type == "flow")
                    options = ej.datavisualization.Diagram.FlowShape(options);
                else if (options.type == "arrow")
                    options = ej.datavisualization.Diagram.ArrowShape(options);
                else if (options.type == "bpmn")
                    options = ej.datavisualization.Diagram.BPMNShape(options);
                else if (options.type == "umlclassifier")
                    options = ej.datavisualization.Diagram.ClassifierShape(options, diagram);
                else if (options.type == "umlactivity")
                    options = ej.datavisualization.Diagram.UMLActivityShape(options, diagram);
            }
        }
        return options;
    };
    ej.datavisualization.Diagram.BasicShape = function (options) {
        options._shape = "path";
        if (!options.shape) options.shape = "rectangle";
        switch (options.shape) {
            case "rectangle":
                options._shape = "rectangle";
                break;
            case "ellipse":
                options._shape = "ellipse";
                break;
            case "path":
                options._shape = "path";
                break;
            case "polygon":
                options._shape = "polygon";
                break;
            case "triangle":
                options.pathData = "M81.1582,85.8677L111.1582,33.9067L141.1582,85.8677L81.1582,85.8677z";
                break;
            case "plus":
                options.pathData = "M696.6084,158.2656L674.8074,158.2656L674.8074,136.4656L658.4084,136.4656L658.4084,158.2656L636.6084,158.2656L636.6084,174.6646L658.4084,174.6646L658.4084,196.4656L674.8074,196.4656L674.8074,174.6646L696.6084,174.6646L696.6084,158.2656z";
                break;
            case "star":
                options.pathData = "M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z";
                break;
            case "pentagon":
                options.pathData = "M370.9702,194.9961L359.5112,159.7291L389.5112,137.9341L419.5112,159.7291L408.0522,194.9961L370.9702,194.9961z";
                break;
            case "heptagon":
                options.pathData = "M223.7783,195.7134L207.1303,174.8364L213.0713,148.8034L237.1303,137.2174L261.1883,148.8034L267.1303,174.8364L250.4813,195.7134L223.7783,195.7134z";
                break;
            case "octagon":
                options.pathData = "M98.7319,196.4653L81.1579,178.8923L81.1579,154.0393L98.7319,136.4653L123.5849,136.4653L141.1579,154.0393L141.1579,178.8923L123.5849,196.4653L98.7319,196.4653z";
                break;
            case "trapezoid":
                options.pathData = "M127.2842,291.4492L95.0322,291.4492L81.1582,256.3152L141.1582,256.3152L127.2842,291.4492z";
                break;
            case "decagon":
                options.pathData = "M657.3379,302.4141L642.3369,291.5161L636.6089,273.8821L642.3369,256.2481L657.3379,245.3511L675.8789,245.3511L690.8789,256.2481L696.6089,273.8821L690.8789,291.5161L675.8789,302.4141L657.3379,302.4141z";
                break;
            case "righttriangle":
                options.pathData = "M836.293,292.9238L776.293,292.9238L776.293,254.8408L836.293,292.9238z";
                break;
            case "cylinder":
                options.pathData = "M 542.802,362.009C 542.802,368.452 525.341,373.676 503.802,373.676C 482.263,373.676 464.802,368.452 464.802,362.009L 464.802,466.484C 464.802,472.928 482.263,478.151 503.802,478.151C 525.341,478.151 542.802,472.928 542.802,466.484L 542.802,362.016C 542.802,368.459 525.341,373.534 503.802,373.534C 482.263,373.534 464.802,368.31 464.802,361.867L 464.802,362.016C 464.802,355.572 482.263,350.349 503.802,350.349C 525.341,350.349 542.802,355.572 542.802,362.016";
                break;
                //case "diamond": options.pathData = "M 397.784,287.875L 369.5,316.159L 341.216,287.875L 369.5,259.591L 397.784,287.875 Z"; break;
        }
        return options;
    };
    ej.datavisualization.Diagram.FlowShape = function (options) {
        options._shape = "path";
        if (!options.shape) options.shape = "process";
        var constraints = options.constraints ? options.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
        if (!(options.constraints & ej.datavisualization.Diagram.NodeConstraints.AspectRatio))
            constraints = constraints | ej.datavisualization.Diagram.NodeConstraints.AspectRatio;
        switch (options.shape) {
            case "process":
                options.pathData = "M419.511,76.687L359.511,76.687L359.511,43.086L419.511,43.086z";
                break;
            case "decision":
                options.pathData = "M 253.005,115.687L 200.567,146.071L 148.097,115.687L 200.534,85.304L 253.005,115.687 Z";
                break;
            case "document":
                options.pathData = "M 60 31.9 c 0 0 -11 -7.7 -30 0 s -30 0 -30 0 V 0 h 60 V 31.9 Z";
                break;
            case "predefinedprocess":
                options.pathData = "M 0,0 L 50,0 L 50,50 L 0,50 Z  M 8.333333333333334,0 L 8.333333333333334,50 M 41.66666666666667,0 L 41.66666666666667,50";
                break;
            case "terminator":
                options.pathData = "M 269.711,29.3333C 269.711,44.061 257.772,56 243.044,56L 158.058,56C 143.33,56 131.391,44.061 131.391,29.3333L 131.391,29.3333C 131.391,14.6057 143.33,2.66669 158.058,2.66669L 243.044,2.66669C 257.772,2.66669 269.711,14.6057 269.711,29.3333 Z";
                break;
            case "papertap":
                options.pathData = "M0.000976562,17.2042 L0.000976562,47.1654 C0.000976562,47.1654 14.403,53.5455 25.001,47.1654 C35.599,40.7852 44.403,43.5087 50.001,47.1654 L50.001,17.2042 M50.001,32.7987 L50.001,2.84052 C50.001,2.84052 35.599,-3.54271 25.001,2.84052 C14.403,9.22376 5.599,6.49418 0.000976562,2.84052 L0.000976562,32.7987";
                break;
            case "directdata":
                options.pathData = "M 1477 613 L 1619 613 C 1627 613 1634 636 1634 665 C 1634 694 1627 717 1619 717 L 1477 717 C 1469 717 1461 694 1461 665 C 1461 636 1469 613 1477 613 ZM 1619 613 C 1610 613 1603 636 1603 665 C 1603 694 1610 717 1619 717M 1619 613 C 1610 613 1603 636 1603 665 C 1603 694 1610 717 1619 717";
                break;
            case "sequentialdata":
                options.pathData = "M0.00297546,24.999 C0.00297546,11.1922 10.433,0.00216177 23.295,0.00216177 C36.159,0.00216177 46.585,11.1922 46.585,24.999 C46.585,38.8057 36.159,49.9979 23.295,49.9979 C10.433,49.9979 0.00297546,38.8057 0.00297546,24.999 z M23.294,49.999 L50.002,49.999";
                break;
            case "sort":
                options.pathData = "M50.001,24.9971 L25.001,49.9971 L0.000976562,24.9971 L25.001,-0.00286865 L50.001,24.9971 z M0.000976562,24.9971 L50.001,24.9971";
                break;
            case "multidocument":
                options.pathData = "M43.6826,40 C44.8746,40.6183 45.8586,41.3502 46.8366,42.1122 L46.8366,4.74487 L3.09857,4.74487 L3.09857,10.9544 M46.837,35.1437 C48.027,35.7653 49.025,36.6042 50.003,37.3695 L50.003,0.0021928 L6.26497,0.0021928 L6.26497,4.74451 M43.6826,47.1132 L43.6826,10.7652 L0.00257874,10.7652 L0.00257874,47.1132 C0.00257874,47.1132 12.5846,53.6101 21.8426,47.1132 C31.1006,40.6163 38.7926,43.3935 43.6826,47.1132 z";
                break;
            case "collate":
                options.pathData = "M50.001,0.00286865 L25.001,25.0029 L0.000976562,0.00286865 L50.001,0.00286865 z M0.000976562,50.0029 L25.001,25.0029 L50.001,50.0029 L0.000976562,50.0029 z";
                break;
            case "summingjunction":
                options.constraints = constraints;
                options.pathData = "M7.3252,42.6768 L42.6772,7.32477 M42.6768,42.6768 L7.3248,7.32477 M0.000976562,25.001 C0.000976562,11.193 11.197,0.000976562 25.001,0.000976562 C38.809,0.000976562 50.001,11.193 50.001,25.001 C50.001,38.809 38.809,50.001 25.001,50.001 C11.197,50.001 0.000976562,38.809 0.000976562,25.001 z";
                break;
            case "or":
                options.pathData = "M 0 50 L 100 50 M 50 100 L 50 0.0 M 0 50 C 0 22.384 22.392 0 50 0 C 77.616 0 100 22.384 100 50 C 100 77.616 77.616 100 50 100 C 22.392 100 0 77.616 0 50 Z";
                break;
            case "internalstorage":
                options.pathData = "M 0 3.8194444444444446A 2.5,3.8194444444444446 0 0,1 2.5,0L 47.5 0A 2.5,3.8194444444444446 0 0,1 50,3.8194444444444446L 50 45.833333333333336A 2.5,3.8194444444444446 0 0,1 47.5,49.65277777777778L 2.5 49.65277777777778A 2.5,3.8194444444444446 0 0,1 0,45.833333333333336L 0 3.8194444444444446ZM 0 11.458333333333334L 50 11.458333333333334M 12.5 0L 12.5 49.65277777777778";
                break;
            case "extract":
                options._shape = "polygon";
                options.constraints = constraints;
                options.points = [{ x: 0, y: 35 }, { x: 30, y: 0 }, { x: 60, y: 35 }];

                break;
            case "manualoperation":
                options._shape = "polygon";
                options.points = [{ x: 46.4, y: 28.8 }, { x: 14.8, y: 28.8 }, { x: 0, y: 0 }, { x: 60, y: 0 }];
                break;
            case "merge":
                options._shape = "polygon";
                options.constraints = constraints;
                options.points = [{ x: 60, y: 0 }, { x: 30, y: 35 }, { x: 0, y: 0 }];
                break;
            case "offpagereference":
                options._shape = "polygon";
                options.points = [{ x: 60, y: 33.3 }, { x: 30.1, y: 39 }, { x: 0, y: 33.3 }, { x: 0, y: 0 }, { x: 60, y: 0 }];
                break;
            case "sequentialaccessstorage":
                options.constraints = constraints;
                options.pathData = "M 60 30 C 60 13.4 46.6 0 30 0 S 0 13.4 0 30 s 13.4 30 30 30 h 28.6 v -6.5 h -9.9 C 55.5 48 60 39.5 60 30 Z";
                break;
            case "annotation1":
                options.pathData = "M49.9984,50.0029 L-0.00271199,50.0029 L-0.00271199,0.00286865 L49.9984,0.00286865";
                break;
            case "annotation2":
                options.pathData = "M49.9977,50.0029 L25.416,50.0029 L25.416,0.00286865 L49.9977,0.00286865 M25.4166,25.0029 L-0.00227869,25.0029";
                break;
                //case "display": options.pathData = "M47.8809,19.2914 L32.7968,-0.00594145 L11.3902,-0.00594145 C7.93166,-0.00594145 0.00124586,11.187 0.00124586,24.9968 C0.00124586,38.8032 7.93166,49.9962 11.3902,49.9962 L32.7968,49.9962 L47.615,31.0388 C47.615,31.0388 52.7986,24.9968 47.8809,19.2914 z"; break;
                //case "delay": options.pathData = "M50.0044,-0.00482496 L18.9098,-0.00482496 L3.46654,18.958 C3.46654,18.958 -4.06481,25.0015 3.07999,30.7062 L18.9098,50.0013 L50.0044,50.0013"; break;
                //case "storeddata": options.pathData = "M 5.555555555555555 0L 50 0A 1.5,30 0 0,1 50,0A 5.555555555555555,25 0 0,0 50,50A 1.5,30 0 0,1 50,50L 5.555555555555555 50A 5.555555555555555,25 0 0,1 5.555555555555555,0Z"; break;
            case "card":
                options._shape = "polygon";
                options.points = [{ x: 275, y: 60 }, { x: 400, y: 60 }, { x: 400, y: 110 }, { x: 260, y: 110 }, { x: 260, y: 75 }]; break;
            case "data": options.pathData = "M 10 0 L 40 0 L 30 40 L 0 40 Z "; break;
        }
        return options;
    };
    ej.datavisualization.Diagram.ArrowShape = function (options) {
        options._shape = "path";
        if (!options.shape) options.shape = "circulararrow";
        switch (options.shape) {
            case "circulararrow":
                options.pathData = "M433.4624,503.8848C429.4244,493.2388,419.1354,485.6678,407.0734,485.6678C391.4884,485.6678,378.8544,498.3018,378.8544,513.8868L384.4984,513.8868C384.4984,501.4178,394.6054,491.3108,407.0734,491.3108C415.9494,491.3108,423.6264,496.4338,427.3144,503.8848L422.9114,503.8848L426.8974,508.8848L430.8824,513.8868L434.8684,508.8848L438.8544,503.8848L433.4624,503.8848z";
                break;
            case "curvedrightarrow":
                options.pathData = "M0.83006144,28.226993 C2.4030598,37.092016 9.5750604,44.49601 19.365042,48.044014 L19.365042,43.129004 25.376032,47.706001 31.386044,52.282999 25.376032,56.858988 19.365042,61.436991 19.365042,55.399027 C8.24608,51.372995 0.50004381,42.368995 0.50004357,31.905003 0.50004381,30.65601 0.6160717,29.429996 0.83006144,28.226993 z M31.402985,0.5 L31.402985,7.4419994 C15.834992,7.4419994 2.9619988,16.497999 0.81800008,28.275999 0.61199981,27.139999 0.49999988,25.981999 0.5,24.803999 0.49999988,11.379999 14.334993,0.5 31.402985,0.5 z";
                break;
            case "curveduparrow":
                options.pathData = "M52.283021,0.51798058 L56.859025,6.5279841 61.436024,12.537989 55.399022,12.537989 C51.373021,23.656996 42.369015,31.403002 31.905011,31.403002 30.65601,31.403002 29.430011,31.288002 28.22701,31.073002 37.092015,29.500999 44.496018,22.328995 48.044018,12.537989 L43.129018,12.537989 47.706021,6.5279841 z M0.5,0.5 L7.4420163,0.5 C7.4420163,16.067989 16.497985,28.940971 28.276,31.083977 27.140013,31.290977 25.981993,31.402 24.804015,31.402 11.380005,31.402 0.5,17.567989 0.5,0.5 z";
                break;
            case "curvedleftarrow":
                options.pathData = "M31.073116,28.227982 C31.287107,29.429977 31.403074,30.65599 31.403074,31.905989 31.403074,42.368966 23.657099,51.372959 12.538074,55.399935 L12.538074,61.436979 6.5270846,56.85898 0.51707193,52.282993 6.5270846,47.706976 12.538074,43.129983 12.538074,48.044958 C22.328056,44.496956 29.500118,37.091961 31.073116,28.227982 z M0.5,0.5 C17.568025,0.5 31.403045,11.380997 31.403045,24.803993 31.403045,25.981992 31.291046,27.139992 31.085045,28.276992 28.941042,16.497995 16.068023,7.442997 0.5,7.442997 z";
                break;
            case "curveddownarrow":
                options.pathData = "M24.804015,0.50000453 C25.981993,0.50000453 27.140013,0.61301103 28.276,0.8180277 16.498045,2.9630154 7.4420161,15.836023 7.4420156,31.404005 L0.5,31.404005 C0.5,14.336024 11.380004,0.50000453 24.804015,0.50000453 z M31.90502,0.5 C42.369025,0.49999976 51.37303,8.2460016 55.399031,19.365004 L61.436034,19.365004 56.859034,25.377005 52.28303,31.387007 47.70603,25.377005 43.129027,19.365004 48.044028,19.365004 C44.496027,9.5760015 37.092024,2.4040001 28.227019,0.82999995 29.43002,0.61699978 30.65602,0.49999976 31.90502,0.5 z";
                break;
            case "jumpingrightarrow":
                options.pathData = "M571.7207,727.7451L563.4507,716.8841L572.3297,716.8841C565.9217,699.1961,552.5427,686.2371,536.5277,683.3951C538.6997,683.0091,540.9157,682.8001,543.1717,682.8001C562.0777,682.8001,578.3457,696.7961,585.6187,716.8841L596.5277,716.8841L588.2577,727.7451L579.9907,738.6041L571.7207,727.7451z";
                break;
            case "jumpingleftarrow":
                options.pathData = "M688.4209,727.7441L696.6889,716.8851L687.8119,716.8851C694.2179,699.1971,707.5989,686.2381,723.6119,683.3941C721.4409,683.0101,719.2259,682.8011,716.9679,682.8011C698.0639,682.8011,681.7959,696.7951,674.5209,716.8851L663.6119,716.8851L671.8839,727.7441L680.1509,738.6031L688.4209,727.7441z";
                break;
                //case "uTurnArrow": options.pathData = "M1093.3154,165.6641L1093.3154,157.0071C1093.3154,145.6621,1084.1184,136.4651,1072.7724,136.4651C1061.4274,136.4651,1052.2304,145.6621,1052.2304,157.0071L1052.2304,196.4651L1061.5834,196.4511L1061.5834,157.5951C1061.5834,151.4141,1066.5934,146.4041,1072.7724,146.4041C1078.9534,146.4041,1083.9624,151.4141,1083.9624,157.5951L1083.9624,165.6641L1074.1574,165.6641L1081.1214,174.9601L1088.0864,184.2561L1095.0514,174.9601L1102.0164,165.6641L1093.3154,165.6641z"; break;
        }
        return options;
    };
    ej.datavisualization.Diagram.UMLConnectorShape = function (options) {
        if (!options.shape.relationship) options.shape.relationship = "association";
        switch (options.shape.relationship) {
            case "association":
                options.shape = ej.datavisualization.Diagram.UMLConnectorAssociation(options.shape);
                break;
            case "aggregation":
                options.shape = ej.datavisualization.Diagram.UMLConnectorAggregation(options.shape);
                break;
            case "composition":
                options.shape = ej.datavisualization.Diagram.UMLConnectorComposition(options.shape);
                break;
            case "realization":
                options.shape = ej.datavisualization.Diagram.UMLConnectorRealization(options.shape);
                break;
            case "dependency":
                options.shape = ej.datavisualization.Diagram.UMLConnectorDependency(options.shape);
                break;
            case "inheritance":
                options.shape = ej.datavisualization.Diagram.UMLConnectorInheritance(options.shape);
                break;
        }
        if (options.shape.type == "umlactivity") {
            options.shape = ej.datavisualization.Diagram.UMLActivityFlow(options.shape);
            if (options.shape.activityFlow == "object") {
                options = $.extend(true, options, { lineDashArray: "8 4", targetDecorator: { shape: "openarrow" }, lineWidth: 2 });
                if (options.labels)
                    for (var i = 0; i < options.labels.length; i++) {
                        options.labels[i] = ej.datavisualization.Diagram.Label(options.labels[i]);
                        options.labels[i].text = "[" + options.labels[i].text + "]"
                    }
            }
            else if (options.shape.activityFlow == "control")
                options = $.extend(true, options, { sourceDecorator: { shape: "none" }, targetDecorator: { shape: "openarrow" }, lineWidth: 2 });
            else if (options.shape.activityFlow == "exception")
                options = $.extend(true, options, { segments: [{ type: "straight" }], sourceDecorator: { shape: "none" }, targetDecorator: { shape: "openarrow" }, });
        }
        else if (options.shape.multiplicity) {
            var labels = [];
            labels = ej.datavisualization.Diagram.ClassifierHelper.umlConnectorMultiplicity(options);
            if (options.labels) {
                for (var i = 0; i < labels.length; i++)
                    options.labels.push(labels[i]);
            }
            else
                options = $.extend(false, {}, { labels: labels }, options);
        }
        if (options.shape.type == "umlclassifier") {
            if (options.shape.relationship == "association") {
                if (options.shape.association == "bidirectional")
                    options = $.extend(true, options, { segments: [{ type: "straight" }], sourceDecorator: { shape: "none" }, targetDecorator: { shape: "none" }, lineWidth: 2 });
                else if (options.shape.association == "directional")
                    options = $.extend(true, options, { segments: [{ type: "straight" }], sourceDecorator: { shape: "none" }, targetDecorator: { shape: "arrow" }, lineWidth: 2 });
            }
            if (options.shape.relationship == "inheritance")
                options = $.extend(true, options, { segments: [{ type: "orthogonal" }], sourceDecorator: { shape: "none" }, targetDecorator: { shape: "arrow", fillColor: "white" }, lineWidth: 2, lineDashArray: "4 4" });
            if (options.shape.relationship == "composition")
                options = $.extend(true, options, { segments: [{ type: "orthogonal" }], sourceDecorator: { shape: "diamond", fillColor: "black" }, targetDecorator: { shape: "none" }, lineWidth: 2 });
            if (options.shape.relationship == "aggregation")
                options = $.extend(true, options, { segments: [{ type: "orthogonal" }], sourceDecorator: { shape: "diamond", fillColor: "white" }, targetDecorator: { shape: "none" }, lineWidth: 2 });
            if (options.shape.relationship == "dependency")
                options = $.extend(true, options, { segments: [{ type: "orthogonal" }], sourceDecorator: { shape: "none" }, targetDecorator: { shape: "openarrow", fillColor: "white" }, lineWidth: 2, lineDashArray: "4 4" });
            if (options.shape.relationship == "realization")
                options = $.extend(true, options, { segments: [{ type: "orthogonal" }], sourceDecorator: { shape: "none" }, targetDecorator: { shape: "arrow", fillColor: "white" }, lineWidth: 2 });

        }
        return options;
    };
    ej.datavisualization.Diagram.BPMNShape = function (options) {
        if (!options.shape) options.shape = "event";
        //if (options._annotation) delete options._annotation;
        if (options.shape != "sequentialflow" || options.shape != "associationflow" || options.shape != "messageflow") {
            if (!(options.labels && options.labels.length))
                options.labels = [{}];
            if (!(options.labels.length && options.labels[0].offset))
                options.labels[0] = $.extend(false, {}, options.labels[0], { offset: { x: 0.5, y: 1 }, verticalAlignment: "top", margin: { top: 2 } });
        }
        switch (options.shape) {
            case "event":
            case "gateway":
            case "dataobject":
            case "activity":
                options._type = "group";
                options._isBpmn = true;
                if (options.children == undefined) options.children = [];
                if (options.shape == "activity" && options.activity == "subprocess" && options.subProcess && options.subProcess.collapsed == false)
                    options = $.extend(true, { container: { type: "canvas" }, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, paddingTop: 10 }, options);
                break;
            case "message":
                options = $.extend(true, options, { _shape: "path", pathData: "M0,0L19.8,12.8L40,0L0,0L0,25.5L40,25.5L40,0z" });
                break;
            case "datasource":
                options = $.extend(true, options, { _shape: "path", pathData: "M 0 10.6 c 0 5.9 16.8 10.6 37.5 10.6 S 75 16.4 75 10.6 v 0 v 68.9 v -0.1 C 75 85.3 58.2 90 37.5 90 S 0 85.3 0 79.4 l 0 0.1 V 56 V 40.6 L 0 10.6 C 0 4.7 16.8 0 37.5 0 S 75 4.7 75 10.6 S 58.2 21.2 37.5 21.2 S 0 16.5 0 10.6 l 0 6.7 v -0.2 c 0 5.9 16.8 10.6 37.5 10.6 S 75 22.9 75 17.1 v 6.8 v -0.1 c 0 5.9 -16.8 10.6 -37.5 10.6 S 0 29.6 0 23.8" });
                break;
            case "group":
                options = $.extend(true, options, { _type: "group", _isBpmn: true, minWidth: options.width, minHeight: options.height, cornerRadius: 10, container: { type: "canvas" }, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, paddingTop: 10, borderDashArray: "2 2 6 2" });
                break;
        }
        return options;
    };
    ej.datavisualization.Diagram.ClassifierShape = function (options, diagram) {
        if (!options.classifier) options.classifier = "class";
        if (!options.labels) options.labels = [{}];
        if (!options.fillColor) options.fillColor = "transparent"
        if (!options.borderColor) options.borderColor = "transparent";
        if (!options.borderWidth) options.borderWidth = 1;
        if (!options.opacity) options.opacity = 1;

        switch (options.classifier) {
            case "class":
                options["class"] = ej.datavisualization.Diagram.ClassifierClass(options["class"])
                for (var i = 0; i < options["class"].attributes.length; i++)
                    options["class"].attributes[i] = ej.datavisualization.Diagram.ClassAttribute(options["class"].attributes[i])
                for (var j = 0; j < options["class"].methods.length; j++)
                    options["class"].methods[j] = ej.datavisualization.Diagram.ClassMethod(options["class"].methods[j])
                options = ej.datavisualization.Diagram.DefautShapes._getClassShape(options, diagram);
                break;
            case "interface":
                options["interface"] = ej.datavisualization.Diagram.ClassifierInterface(options["interface"]);
                for (var i = 0; i < options["interface"].attributes.length; i++)
                    options["interface"].attributes[i] = ej.datavisualization.Diagram.ClassAttribute(options["interface"].attributes[i])
                for (var j = 0; j < options["interface"].methods.length; j++)
                    options["interface"].methods[j] = ej.datavisualization.Diagram.ClassMethod(options["interface"].methods[j])
                //  options = $.extend(false, {}, ej.datavisualization.Diagram.ClassifierInterface(), options);
                options = ej.datavisualization.Diagram.DefautShapes._getClassShape(options, diagram);
                break;
            case "enumeration":
                options.enumeration = ej.datavisualization.Diagram.ClassifierEnumeration(options.enumeration);
                //  options = $.extend(false, {}, ej.datavisualization.Diagram.ClassifierEnumeration(), options);
                options = ej.datavisualization.Diagram.DefautShapes._getClassShape(options, diagram);
                break;
            case "member":
                options.labels[0] = $.extend(false, {}, { name: options.name + "_member", horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 }, text: "Member" }, options.labels[0]);
                options = $.extend(false, {}, { borderColor: "transparent", fillColor: "transparent", _shape: "rectangle", horizontalAlign: "stretch", verticalAlign: "bottom", _isClassMember: true }, options);
                break;
            case "package":
                //  options = ej.datavisualization.Diagram.DefautShapes._getUMLPackageShape(options, diagram);
                break;
            case "collapsedpackage":
                // options.labels[0] = $.extend(false, {}, { offset: { x: 0.5, y: 0.5 }, text: options.packageName }, options.labels[0]);
                //  options = $.extend(false, {}, { _shape: "rectangle" }, options);
                break;
        }
        return options;
    };
    ej.datavisualization.Diagram.UMLActivityShape = function (options) {
        options.type = "umlactivity";
        if (!options.shape) options.shape = "action";
        options._shape = "path";
        // options.port = [];
        switch (options.shape) {
            case "action":
                options.pathData = "M 90 82.895 C 90 86.819 86.776 90 82.8 90 H 7.2 C 3.224 90 0 86.819 0 82.895 V 7.105 C 0 3.181 3.224 0 7.2 0 h 75.6 C 86.776 0 90 3.181 90 7.105 V 82.895 Z";
                break;
            case "decision":
                options.pathData = "M10,19.707L0.293,10L10,0.293L19.707,10L10,19.707z";
                break;
            case "mergenode":
                options.pathData = "M10,19.707L0.293,10L10,0.293L19.707,10L10,19.707z";
                break;
            case "initialnode":
                options.pathData = "M10,19.5c-5.238,0-9.5-4.262-9.5-9.5S4.762,0.5,10,0.5s9.5,4.262,9.5,9.5S15.238,19.5,10,19.5z";
                break;
            case "finalnode":
                options.borderColor = "transparent";
                options._type = "group";
                var childNodes = [], i = 0;
                var constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.PointerEvents | ej.datavisualization.Diagram.NodeConstraints.Connect | ej.datavisualization.Diagram.NodeConstraints.Resize);
                childNodes.push({
                    name: options.name + "_activity_final_1", width: options.width, height: options.height, offsetX: options.offsetX, offsetY: options.offsetY,
                    constraints: constraints | ej.datavisualization.Diagram.NodeConstraints.Resize, type: "node", shape: "path",
                    pathData: "M164.1884,84.6909000000001C156.2414,84.6909000000001,149.7764,78.2259000000001,149.7764,70.2769000000001C149.7764,62.3279000000001,156.2414,55.8629000000001,164.1884,55.8629000000001C172.1354,55.8629000000001,178.6024,62.3279000000001,178.6024,70.2769000000001C178.6024,78.2259000000001,172.1354,84.6909000000001,164.1884,84.6909000000001"
                });
                childNodes.push({
                    name: options.name + "_activity_final_2", width: options.width / 2, height: options.height / 2, fillColor: "black", offsetX: options.offsetX, offsetY: options.offsetY,
                    constraints: constraints | ej.datavisualization.Diagram.NodeConstraints.Resize, type: "node", shape: "path",
                    pathData: "M 25 50 C 11.21 50 0 38.79 0 25 C 0 11.21 11.21 0 25 0 C 38.78 0 50 11.21 50 25 C 50 38.79 38.78 50 25 50"
                });
                for (i = 0; i < childNodes.length; i++)
                    childNodes[i] = ej.datavisualization.Diagram.Node(childNodes[i]);
                options.elementType = "group";
                options.children = childNodes; break;
            case "forknode":
                options.width = options.width ? options.width : 40;
                options.height = 5;
                options.fillColor = "black"
                options.pathData = "m0.75,0.75l636.00002,0l0,290l-636.00002,0l0,-290z";
                options.labels = [{ readOnly: true }];
                //options.ports = [];
                break;
            case "joinnode":
                options.width = options.width ? options.width : 40;
                options.height = 5;
                options.fillColor = "black"
                options.pathData = "m0.75,0.75l636.00002,0l0,290l-636.00002,0l0,-290z";
                options.labels = [{ readOnly: true }];
                //options.ports = [];
                break;
            case "timeevent":
                options.pathData = "M50.001,0.00286865 L25.001,25.0029 L0.000976562,0.00286865 L50.001,0.00286865 z M0.000976562,50.0029 L25.001,25.0029 L50.001,50.0029 L0.000976562,50.0029 z";
                break;
            case "acceptingevent":
                options.pathData = "M17.8336 32.164 L29.64 24 L17.32 16 L48.1664 16 L48.5 32 Z";
                break;
            case "sendsignal":
                options.pathData = "M48.164 31.8336 L56 23.832 L47.836 16 L16.168 16 L16.1668 31.8336 Z";
                break;
            case "receivesignal":
                options.pathData = "M48.1664 31.8336 L39.836 24 L47.836 16 L16.168 16 L16.168 31.836 Z";
                break;
            case "structurednode":
                options._shape = "rectangle";
                options.borderDashArray = "2 3";
                if (options.labels && options.labels.length > 0)
                    options.labels = [{ text: "<<" + options.labels[0].text + ">>", wrapText: "nowrap", fillColor: "white" }];
                break;
            case "note":
                options.pathData = "M20 12 L4 12 L4 22 L22 22 L22 14 L20 14 L20 12 L22 14 Z";
                break;
        }
        return options;
    };
    ej.datavisualization.Diagram.DefautShapes = {
        //#region BPMN
        _getBPMNEventShape: function (options, diagram) {
            var childNodes = [], i;
            if (options.children == undefined) options.children = [];
            options._type = "group";
            options.canUngroup = false;
            options.offset = options.offset || {}
            options.offset = ej.datavisualization.Diagram.Point(options.offset.x ? options.offset.x : null, options.offset.y ? options.offset.y : null)
            options = $.extend(false, {}, ej.datavisualization.Diagram.BPMNEventDefaults, options);
            for (i = 0; i < options.children.length; i++) {
                if (diagram.nameTable[options.children[i].name || options.children[i]]) {
                    childNodes.push(diagram.nameTable[options.children[i].name || options.children[i]]);
                    childNodes[i].rotateAngle = options.rotateAngle;
                }
            }
            var pivot = options.pivot || { x: 0.5, y: 0.5 };
            var centerX = options.offsetX ? (options.offsetX - options.width * pivot.x + options.width / 2) : options.width * pivot.x + options.width / 2;
            var centerY = options.offsetY ? (options.offsetY - options.height * pivot.y + options.height / 2) : options.height * pivot.y + options.height / 2;
            if (!childNodes.length) {
                var constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.PointerEvents | ej.datavisualization.Diagram.NodeConstraints.Connect);
                var defaultProperty = { parent: options.name, type: "node", shape: "path", offsetX: centerX, offsetY: centerY, ports: [], rotateAngle: options.rotateAngle, constraints: constraints, _isDisabled: true, _isInternalShape: true };
                childNodes.push({ name: options.name + "_0", width: options.width, height: options.height });
                childNodes.push({ name: options.name + "_1", width: options.width * .85, height: options.height * .85 });
                childNodes.push({ name: options.name + "_2", width: options.width * .5, height: options.height * .5 });
                for (i = 0; i < childNodes.length; i++)
                    childNodes[i] = ej.datavisualization.Diagram.Node($.extend(false, {}, defaultProperty, childNodes[i]));
            }
            options.constraints = options.constraints ? options.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
            options.children = this._updateBPMNEventShape(options, childNodes, options.event, options.trigger);
            return options;
        },
        _getBPMNGatewayShape: function (options, diagram) {
            var childNodes = [], i;
            if (options.children == undefined) options.children = [];
            options._type = "group";
            options.canUngroup = false;
            options = $.extend(false, {}, ej.datavisualization.Diagram.BPMNGatewayDefaults, options);
            for (i = 0; i < options.children.length; i++) {
                if (diagram.nameTable[options.children[i].name || options.children[i]]) {
                    childNodes.push(diagram.nameTable[options.children[i].name || options.children[i]]);
                    childNodes[i].rotateAngle = options.rotateAngle;
                }
            }
            var pivot = options.pivot || { x: 0.5, y: 0.5 };
            var centerX = options.offsetX ? (options.offsetX - options.width * pivot.x + options.width / 2) : options.width * pivot.x + options.width / 2;
            var centerY = options.offsetY ? (options.offsetY - options.height * pivot.y + options.height / 2) : options.height * pivot.y + options.height / 2;
            if (!childNodes.length) {
                var constraints = ej.datavisualization.Diagram.NodeConstraints.Default ^ (ej.datavisualization.Diagram.NodeConstraints.PointerEvents | ej.datavisualization.Diagram.NodeConstraints.Connect);
                var defaultProperty = { parent: options.name, type: "node", shape: "path", offsetX: centerX, offsetY: centerY, ports: [], rotateAngle: options.rotateAngle, constraints: constraints, _isDisabled: true, _isInternalShape: true };
                childNodes.push({ name: options.name + "_0", width: options.width, height: options.height, pathData: "M 40 20 L 20 40 L 0 20 L 20 0 L 40 20 Z" });
                childNodes.push({ name: options.name + "_1", width: options.width * .45, height: options.height * .45 });
                for (i = 0; i < childNodes.length; i++)
                    childNodes[i] = ej.datavisualization.Diagram.Node($.extend(false, {}, defaultProperty, childNodes[i]));
            }
            if (childNodes && childNodes[0]) {
                constraints = childNodes[0].constraints ? childNodes[0].constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
                if (options.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                    constraints = constraints | ej.datavisualization.Diagram.NodeConstraints.Shadow;
                }
            }
            options.children = childNodes;
            options.constraints = options.constraints ? options.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
            $.extend(true, childNodes, [{ fillColor: options.fillColor, constraints: constraints, shadow: options.shadow, borderColor: options.borderColor, borderWidth: options.borderWidth, opacity: options.opacity, gradient: options.gradient }, { opacity: options.opacity, fillColor: "black", visible: true }]);
            switch (options.gateway) {
                case "none":
                    childNodes[1].visible = false;
                    break;
                case "exclusive":
                    childNodes[1].pathData = "M 11.196 29.009 l 6.36 -9.712 l -5.764 -8.899 h 4.393 l 3.732 5.979 l 3.656 -5.979 h 4.354 l -5.789 9.039 l 6.36 9.572 h -4.532 l -4.126 -6.437 l -4.139 6.437 H 11.196 Z";
                    break;
                case "inclusive":
                    childNodes[1].pathData = "M 20.323 31.333 c -6.625 0 -12.015 -5.39 -12.015 -12.015 s 5.39 -12.015 12.015 -12.015 s 12.016 5.39 12.016 12.015 S 26.948 31.333 20.323 31.333 Z M 20.323 9.303 c -5.522 0 -10.015 4.493 -10.015 10.015 s 4.492 10.015 10.015 10.015 s 10.016 -4.493 10.016 -10.015 S 25.846 9.303 20.323 9.303 Z";
                    break;
                case "parallel":
                    childNodes[1].pathData = "M 18.394 29.542 v -8.833 H 9.626 v -3.691 h 8.768 V 8.251 h 3.734 v 8.767 h 8.768 v 3.691 h -8.768 v 8.833 H 18.394 Z";
                    break;
                case "complex":
                    childNodes[1].pathData = "M29.198,19.063L23.089,19.063L27.794,14.358L26.38,12.944L21.223,18.101L21.223,10.443L19.223,10.443L19.223,17.976L14.022,12.776L12.608,14.19L17.48,19.063L10.365,19.063L10.365,21.063L18.261,21.063L12.392,26.932L13.806,28.346L19.223,22.929L19.223,30.225L21.223,30.225L21.223,22.805L25.925,27.507L27.339,26.093L22.309,21.063L29.198,21.063z";
                    break;
                case "eventbased":
                    childNodes[1].fillColor = "white";
                    childNodes[1].pathData = "M 20.322 29.874 c -5.444 0 -9.873 -4.43 -9.873 -9.874 s 4.429 -9.874 9.873 -9.874 s 9.874 4.429 9.874 9.874 S 25.767 29.874 20.322 29.874 Z M 20.322 32.891 c -7.107 0 -12.89 -5.783 -12.89 -12.891 c 0 -7.107 5.782 -12.89 12.89 -12.89 c 7.108 0 12.891 5.783 12.891 12.89 C 33.213 27.108 27.431 32.891 20.322 32.891 Z M 24.191 25.386 h -7.984 l -2.469 -7.595 l 6.461 -4.693 l 6.461 4.693 L 24.191 25.386 Z";
                    break;
                case "exclusiveeventbased":
                    childNodes[1].fillColor = "white";
                    childNodes[1].pathData = "M 30 15 C 30 23.28 23.28 30 15 30 S 0 23.28 0 15 S 6.72 0 15 0 S 30 6.72 30 15 z M 15 5 L 5 12.5 L 8 22.5 H 22 L 25 12.5 z";
                    break;
                case "paralleleventbased":
                    childNodes[1].fillColor = "white";
                    childNodes[1].pathData = "M 35 17.5 C 35 27.16 27.16 35 17.5 35 S 0 27.16 0 17.5 S 7.84 0 17.5 0 S 35 7.84 35 17.5 z M 14.58 5.83 V 14.58 H 5.83 V 20.42 H 14.58 V 29.17 H 20.42 V 20.42 H 29.17 V 14.58 H 20.42 V 5.83 z";
                    break;
            }
            return options;
        },
        /*  _getUMLPackageShape: function (options, diagram) {
              var childNodes = [], i, x, y;
              var x = options.offsetX - options.width / 2, y = options.offsetY - options.height / 2;
              if (!options.children) {
                  var constraints = ej.datavisualization.Diagram.NodeConstraints.Default ^ (ej.datavisualization.Diagram.NodeConstraints.Select | ej.datavisualization.Diagram.NodeConstraints.Connect);
                  var defaultProperty = { parent: options.name, shape: "path", ports: [], borderColor: options.borderColor, borderWidth: options.borderWidth, constraints: constraints };
                  var labelWidth = options.packageName.length * 10;
                  childNodes.push({ name: options.name + "_package_header" + "_classifier", minWidth: labelWidth, maxWidth: options.width, minHeight: 26, type: "node", offsetX: x + labelWidth / 2, offsetY: y + 13, pathData: "M79.75,65.786H8.91v-47.5h70.84V65.786z", labels: [{ text: options.packageName, horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 }, margin: { left: 5, right: 5, top: 4, bottom: 4 }, fontSize: 14, bold: true }], _isClassMember: true, });
                  childNodes.push({ name: options.name + "_package_content" + "_classifier", minWidth: options.width, minHeight: options.height - 26, type: "group", offsetX: x + options.width / 2, offsetY: y + 26 + (options.height - 26) * .5, fillColor: "transparent", pathData: "M39.083,19.286H8.91V9.37h30.173V19.286z", container: { type: "canvas", orientation: "vertical" }, children: [], labels: [{ readOnly: true }], paddingRight: 10, paddingLeft: 10, paddingTop: 10, paddingBottom: 10, allowDrop: true, _isPackage: true });
                  for (i = 0; i < childNodes.length; i++)
                      childNodes[i] = ej.datavisualization.Diagram.Node($.extend(false, {}, defaultProperty, childNodes[i]));
                  if (childNodes[1].constraints)
                      childNodes[1].constraints |= ej.datavisualization.Diagram.NodeConstraints.AllowDrop;
                  var classnodes = [];
                  if (options.members) {
                      for (var i = 0; i < options.members.length; i++) {
                          var classnode = ej.datavisualization.Diagram.ClassifierShape(options.members[i], diagram);
                          classnode.parent = childNodes[1].name;
                          classnodes.push(classnode);
                      }
                      for (var j = 0; j < classnodes.length;j++)
                          childNodes[1].children.push( classnodes[j]);
                  }
                  options.children = childNodes;
                  options._type = "group";
                  options.labels[0] = $.extend(false, {}, { readOnly: true }, options.labels[0]);
                  options.container = { type: "stack", orientation: "vertical" };
                  options.allowDrop = false;
                  options.constraints = options.constraints ? options.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
                  options.constraints = options.constraints & ~(ej.datavisualization.Diagram.NodeConstraints.Connect | ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast | ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest | ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest | ej.datavisualization.Diagram.NodeConstraints.ResizeWest | ej.datavisualization.Diagram.NodeConstraints.ResizeNorth);
              }
              else {
                  for (i = 0; i < options.children.length; i++)
                      if (diagram.nameTable[options.children[i].name]) {
                          if (diagram.nameTable[options.children[i].name || options.children[i]])
                              childNodes.push(diagram.nameTable[options.children[i].name || options.children[i]]);
                      }
                      else
                          childNodes.push(typeof options.children[i] == "object" ? options.children[i] : diagram.nameTable[options.children[i]]);
              }
              childNodes[0].fillColor = options.fillColor;
              childNodes[0].borderColor = options.borderColor;
              childNodes[0].borderWidth = options.borderWidth;
              childNodes[0].opacity = options.opacity;
              if (options.gradient) childNodes[0].gradient = options.gradient;
              return options;
          },*/
        _getClassShape: function (options, diagram) {
            var childNodes = [], i, textNode, height, width;
            var attributeText = "", methodText = "", memberText = "", argumentText = "";
            if (!options.children) {
                var constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.Select | ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast | ej.datavisualization.Diagram.NodeConstraints.ResizeWest | ej.datavisualization.Diagram.NodeConstraints.ResizeSouthEast | ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest | ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest | ej.datavisualization.Diagram.NodeConstraints.ResizeNorth | ej.datavisualization.Diagram.NodeConstraints.ResizeSouth | ej.datavisualization.Diagram.NodeConstraints.Connect | ej.datavisualization.Diagram.NodeConstraints.Rotate | ej.datavisualization.Diagram.NodeConstraints.ResizeEast | ej.datavisualization.Diagram.NodeConstraints.Drag);
                var defaultProperty = { width: options.width, offsetX: options.offsetX, parent: options.name, ports: [], fillColor: "transparent", borderColor: options.borderColor, type: "node", labels: [{ margin: { left: 5, right: 5, top: 5, bottom: 5 } }], _isClassMember: true };
                if (options.fillColor) defaultProperty.fillColor = options.fillColor;
                if (options.borderColor) defaultProperty.borderColor = options.borderColor;
                if (options.borderWidth) defaultProperty.borderWidth = options.borderWidth
                if (options.labels) {
                    for (var i = 0; i < options.labels.length; i++)
                        defaultProperty.labels[i] = $.extend(false, {}, defaultProperty.labels[i], options.labels[i])
                }
                switch (options.classifier) {
                    case "class":
                        childNodes.push({ ports: [], name: options.name + "_header" + "_classifier", minHeight: 30, labels: [{ name: "title", offset: { x: 0.5, y: 0.65 }, text: options["class"].name, bold: true, fontSize: 14 }, { name: "class", offset: { x: 0.5, y: 0.25 }, text: "<<Class>>" }], constraints: constraints });
                        break;
                    case "interface":
                        childNodes.push({ name: options.name + "_header" + "_classifier", minHeight: 40, labels: [{ name: "title", offset: { x: 0.5, y: 0.65 }, text: options["interface"].name, bold: true, fontSize: 14 }, { name: "interface", offset: { x: 0.5, y: 0.25 }, text: "<<Interface>>" }], constraints: constraints });
                        break;
                    case "enumeration":
                        childNodes.push({ name: options.name + "_header" + "_classifier", minHeight: 40, labels: [{ name: options.name + "Label1", offset: { x: 0.5, y: 0.65 }, text: options.enumeration.name, bold: true, fontSize: 14 }, { name: options.name + "enumeration", offset: { x: 0.5, y: 0.25 }, text: "<<Enumeration>>" }], constraints: constraints });
                        break;
                }
                var attribute = options["class"] ? options["class"] : options["interface"];
                if (attribute && attribute.attributes && attribute.attributes.length) {
                    for (i = 0; i < (attribute.attributes.length) ; i++) {
                        attribute.attributes[i] = ej.datavisualization.Diagram.ClassAttribute(attribute.attributes[i]);
                        if (options.Interface)
                            attribute.attributes[i].scope = ej.datavisualization.Diagram.ScopeValueDefaults.Public;
                        if (attribute.attributes[i].scope && attribute.attributes[i].scope == "public")
                            var text = "+";
                        if (attribute.attributes[i].scope && attribute.attributes[i].scope == "private")
                            text = "-";
                        if (attribute.attributes[i].scope && attribute.attributes[i].scope == "protected")
                            text = "#";
                        if (attribute.attributes[i].scope && attribute.attributes[i].scope == "package")
                            text = "~";
                        if (attribute.attributes[i].name != "")
                            if (text)
                                attributeText += text + " " + attribute.attributes[i].name + " " + ": " + attribute.attributes[i].type;
                            else
                                attributeText += attribute.attributes[i].name + ": " + attribute.attributes[i].type;
                        if (i != attribute.attributes.length - 1)
                            attributeText += "\n";
                    }
                    if (attributeText)
                        childNodes.push({ name: options.name + "_attribute" + "_classifier", labels: [{ text: attributeText, horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 } }], constraints: constraints });
                }
                var member = options.enumeration;
                if (member && member.members && member.members.length) {
                    for (i = 0; i < member.members.length; i++) {
                        member.members[i] = ej.datavisualization.Diagram.ClassMember(member.members[i]);
                        if (member.members[i].name != "")
                            memberText += member.members[i].name;
                        if (i != member.members.length - 1)
                            memberText += "\n";
                    }
                    if (memberText)
                        childNodes.push({ name: options.name + "_member" + "_classifier", labels: [{ text: memberText, horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 } }], constraints: constraints });
                }
                var method = options["class"] ? options["class"] : options["interface"];
                if (method && method.methods && method.methods.length) {
                    for (i = 0; i < method.methods.length ; i++) {
                        method.methods[i] = ej.datavisualization.Diagram.ClassMethod(method.methods[i]);
                        if (method.methods[i].scope && method.methods[i].scope == "public")
                            var text = "+";
                        if (method.methods[i].scope && method.methods[i].scope == "private")
                            text = "-";
                        if (method.methods[i].scope && method.methods[i].scope == "protected")
                            text = "#";
                        if (method.methods[i].scope && method.methods[i].scope == "package")
                            text = "~";
                        if (method.methods[i].arguments) {
                            for (var j = 0; j < method.methods[i].arguments.length; j++) {
                                if (method.methods[i].arguments[j].type)
                                    argumentText += method.methods[i].arguments[j].name + ":" + method.methods[i].arguments[j].type;
                                else
                                    argumentText += method.methods[i].arguments[j].name;
                                if (j != method.methods[i].arguments.length - 1)
                                    argumentText += ",";
                            }
                        }
                        if (method.methods[i].name != "") {
                            if (text)
                                methodText += text + " " + method.methods[i].name + "(" + argumentText + ")" + " " + ":" + " " + method.methods[i].type;
                            else
                                methodText += method.methods[i].name + "(" + argumentText + ")" + " " + ":" + method.methods[i].type;
                        }
                        if (i != method.methods.length - 1)
                            methodText += "\n";
                    }
                    if (methodText)
                        childNodes.push({ name: options.name + "_method" + "_classifier", labels: [{ text: methodText, horizontalAlignment: "left", textAlign: "left", offset: { x: 0, y: 0.5 } }], constraints: constraints });
                }
                for (i = 0; i < childNodes.length; i++) {
                    childNodes[i] = ej.datavisualization.Diagram.Node($.extend(false, {}, defaultProperty, childNodes[i]));
                    for (var j = 0; j < childNodes[i].labels.length; j++)
                        childNodes[i].labels[j] = $.extend(false, {}, childNodes[i].labels[j], defaultProperty.labels[0]);
                }
                options.children = childNodes;
                options._type = "group";
                //  options.labels[0] = $.extend(false, {}, { readOnly: true }, options.labels[0]);
                options.constraints = options.constraints ? options.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
                options.constraints = options.constraints & ~(ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast | ej.datavisualization.Diagram.NodeConstraints.ResizeWest | ej.datavisualization.Diagram.NodeConstraints.ResizeSouthEast | ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest | ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest | ej.datavisualization.Diagram.NodeConstraints.ResizeNorth | ej.datavisualization.Diagram.NodeConstraints.ResizeSouth | ej.datavisualization.Diagram.NodeConstraints.Rotate | ej.datavisualization.Diagram.NodeConstraints.ResizeEast | ej.datavisualization.Diagram.NodeConstraints.Drag);
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes.length == 1) {
                        if (options["class"]) {
                            delete options["class"].attributes;
                            delete options["class"].methods;
                        }
                        if (options["interface"]) {
                            delete options["interface"].attributes;
                            delete options["interface"].methods;
                        }
                        if (options.enumeration)
                            delete options.enumeration.members;
                    }
                    if (childNodes.length == 2) {
                        options.children[i] = typeof options.children[i] == "string" ? diagram.nameTable[options.children[i]] : options.children[i];
                        if (options["class"]) {
                            if (options.children[i].name.match("attribute"))
                                delete options["class"].methods;
                            if (options.children[i].name.match("method"))
                                delete options["class"].attributes;
                        }
                        if (options["interface"]) {
                            if (options.children[i].name.match("attribute"))
                                delete options["interface"].methods;
                            if (options.children[i].name.match("method"))
                                delete options["interface"].attributes;
                        }
                    }
                }
            }
            else {
                for (i = 0; i < options.children.length; i++)
                    if (diagram.nameTable[options.children[i].name || options.children[i]])
                        childNodes.push(diagram.nameTable[options.children[i].name || options.children[i]]);
                if (childNodes.length <= 0 && options.children.length > 0) {
                    for (var j = 0; j < options.children.length; j++)
                        childNodes.push(options.children[j]);
                }
            }

            options._height = 0;
            for (i = 0; i < childNodes.length; i++) {
                diagram._getNodeDimension(childNodes[i], childNodes[i].labels[0]);
                //   this._updateClassNode(childNodes[i], options)
                height = childNodes[i].height ? childNodes[i].height : childNodes[i]._height;
                childNodes[i].offsetY = options._height + height / 2;
                options._height += height;
            }
            width = childNodes[0]._width;
            if (childNodes[1])
                width = childNodes[0]._width > childNodes[1]._width ? childNodes[0]._width : childNodes[1]._width
            if (childNodes[2])
                width = childNodes[2]._width > width ? childNodes[2]._width : width;
            childNodes[0].width = width;
            if (childNodes[1])
                childNodes[1].width = width;
            if (childNodes[2])
                childNodes[2].width = width;
            options._width = width;
            options.width = options._width;
            options.height = options._height;
            for (i = 0; i < childNodes.length; i++)
                childNodes[i].offsetY += (options.offsetY - options.height / 2);
            return options;
        },
        _updateClassNode: function (node, parent) {
            if (node.name.match("_header")) {
                if (parent.type == "class") parent.className = node.labels[0].text;
                else if (parent.type == "interface") parent.interfaceName = node.labels[0].text;
                else parent.enumerationName = node.labels[0].text;
            }
            else {
                var type = node.name.match("_attribute") ? "attribute" : (node.name.match("_method") ? "method" : "member");
                var label = node.labels[0];
                var str = label.text.split("\n");
                var classMember = [], data, i;
                for (i = 0; i < str.length; i++) {
                    var text = parent["Class"] ? parent["Class"] : parent.Interface;
                    switch (type) {
                        case "attribute":
                            data = str[i].split(/:[ ]*/g);
                            classMember.push(ej.datavisualization.Diagram.ClassMember({ name: data[0], type: data[1] }));
                            break;
                        case "method":
                            data = str[i].replace(")", "").replace("(", ":").split(/:[ ]*/g);
                            classMember.push(ej.datavisualization.Diagram.ClassMember({ name: data[0], returnType: data[1], parameter: data[2] }));
                            break;
                        case "member":
                            classMember.push(ej.datavisualization.Diagram.ClassMember({ name: str[i] }));
                            break;
                    }
                }
                if (type == "attribute") parent.attributes = classMember;
                else if (type == "method") parent.methods = classMember;
                else parent.members = classMember;
            }

        },
        _getBPMNDataShape: function (options, diagram) {
            var childNodes = [], i;
            if (options.children == undefined) options.children = [];
            options._type = "group";
            var pivot = options.pivot || { x: 0.5, y: 0.5 };
            options.canUngroup = false;
            options.data = ej.datavisualization.Diagram.BPMNDataObject(options.data);
            options = $.extend(false, {}, ej.datavisualization.Diagram.BPMNDataObjectDefaults, options);
            var x = options.offsetX ? options.offsetX - options.width * pivot.x : options.width * pivot.x;
            var y = options.offsetY ? options.offsetY - options.height * pivot.y : options.height * pivot.y;
            for (i = 0; i < options.children.length; i++) {
                if (diagram.nameTable[options.children[i].name || options.children[i]]) {
                    childNodes.push(diagram.nameTable[options.children[i].name || options.children[i]]);
                    childNodes[i].rotateAngle = options.rotateAngle;
                }
            }
            var centerX = options.offsetX ? (options.offsetX - options.width * pivot.x + options.width / 2) : options.width * pivot.x + options.width / 2;
            if (!childNodes.length) {
                var constraints = ej.datavisualization.Diagram.NodeConstraints.Default ^ (ej.datavisualization.Diagram.NodeConstraints.PointerEvents | ej.datavisualization.Diagram.NodeConstraints.Connect | ej.datavisualization.Diagram.NodeConstraints.Resize);
                var defaultProperty = { parent: options.name, type: "node", shape: "path", offsetX: centerX, ports: [], rotateAngle: options.rotateAngle, constraints: constraints, _isDisabled: true, _isInternalShape: true };
                childNodes.push({ name: options.name + "_0", width: options.width, height: options.height, offsetY: y + options.height / 2, addInfo: { offset: { x: 0.5, y: 0.5 } }, shape: "polygon", points: [{ x: 29.904, y: 5 }, { x: 7.853, y: 5 }, { x: 7.853, y: 45 }, { x: 42.147, y: 45 }, { x: 42.147, y: 17.242 }, { x: 29.932, y: 5 }, { x: 29.932, y: 17.242 }, { x: 42.147, y: 17.242 }] });
                childNodes.push({ name: options.name + "_1", width: 7.5, height: 15, offsetY: 85 + y, addInfo: { offset: { x: .5, y: 1 }, margin: { bottom: 15 } }, fillColor: "black", pathData: "M 0 0 L 0.1 0 L 0.1 2 L 0 2 Z M 0.4 0 L 0.6 0 L 0.6 2 L0.4 2 Z M 0.9 0 L 1 0 L 1 2 L 0.9 2 Z " });
                childNodes.push({ name: options.name + "_2", width: 25, height: 20, offsetX: x + 15, offsetY: y + 15, addInfo: { offset: { x: 0, y: 0 }, margin: { left: 17.5, top: 15 } }, borderColor: "black", fillColor: "white", pathData: "M 3 9.4 l 6 0 v 2.4 l 3.6 -4 L 9 4 v 2.5 H 3 V 9.4 Z" });
                for (i = 0; i < childNodes.length; i++)
                    childNodes[i] = ej.datavisualization.Diagram.Node($.extend(false, {}, defaultProperty, childNodes[i]));
            }
            options.children = childNodes;
            options.constraints = options.constraints ? options.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
            $.extend(true, childNodes, [{ fillColor: options.fillColor, constraints: options.constraints, shadow: options.shadow, borderColor: options.borderColor, borderWidth: options.borderWidth, opacity: options.opacity, gradient: options.gradient }, { opacity: options.opacity, visible: options.data.collection }, { opacity: options.opacity, visible: true }]);
            switch (options.data.type) {
                case "none":
                    childNodes[2].visible = false;
                    break;
                case "input":
                    childNodes[2].fillColor = "white";
                    break;
                case "output":
                    childNodes[2].fillColor = "black";
                    break;
            }
            return options;
        },
        _getBPMNActivityShape: function (options, diagram) {
            var childNodes = [], childTable = {}, i;
            if (options.children == undefined) options.children = [];
            options._type = "group";
            options.canUngroup = false;
            options.task = ej.datavisualization.Diagram.BPMNTask(options.task);
            options.subProcess = ej.datavisualization.Diagram.BPMNSubProcess(options.subProcess);
            options = $.extend(false, {}, ej.datavisualization.Diagram.BPMNActivityDefaults, options);
            for (i = 0; i < options.children.length; i++) {
                if (diagram.nameTable[options.children[i].name || options.children[i]]) {
                    childNodes.push(diagram.nameTable[options.children[i].name || options.children[i]]);
                    childNodes[i].rotateAngle = options.rotateAngle;
                }
            }
            if (!childNodes.length) {
                var constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.PointerEvents | ej.datavisualization.Diagram.NodeConstraints.Connect | ej.datavisualization.Diagram.NodeConstraints.Resize);
                var defaultProperty = { parent: options.name, type: "node", shape: "path", ports: [], labels: [], constraints: constraints, rotateAngle: options.rotateAngle, _isDisabled: true, _isInternalShape: true };
                childNodes.push({ name: options.name + "_activity", width: options.width, height: options.height, addInfo: { offset: { x: 0.5, y: 0.5 } }, constraints: constraints | ej.datavisualization.Diagram.NodeConstraints.Resize });
                childNodes.push({ name: options.name + "_taskType", width: 14, height: 14, borderColor: "black", addInfo: { offset: { x: 0, y: 0 }, hAlign: "left", vAlign: "top", margin: { left: 14, top: 14 } }, pathData: "M10 0L40 0L30 40L0 40Z" });
                childNodes.push({ name: options.name + "_loop", width: 12, height: 12, addInfo: { offset: { x: 0.5, y: 1 }, hAlign: "center", vAlign: "bottom", margin: { bottom: 12 } }, borderColor: "black", fillColor: "black", pathData: "M10 0L40 0L30 40L0 40Z" });
                childNodes.push({ name: options.name + "_compensation", width: 12, height: 12, addInfo: { offset: { x: 0.5, y: 1 }, hAlign: "center", vAlign: "bottom", margin: { bottom: 12 } }, borderColor: "black", fillColor: "black", pathData: "M10 0L40 0L30 40L0 40Z" });
                childNodes.push({ name: options.name + "_expanded", width: 12, height: 12, constraints: constraints, addInfo: { offset: { x: 0.5, y: 1 }, hAlign: "center", vAlign: "bottom", margin: { bottom: 12 } }, borderColor: "black", fillColor: "black", pathData: "M10 0L40 0L30 40L0 40Z" });
                childNodes.push({ name: options.name + "_adhoc", width: 12, height: 8, addInfo: { offset: { x: 0.5, y: 1 }, hAlign: "center", vAlign: "bottom", margin: { bottom: 12 } }, borderColor: "black", fillColor: "black", pathData: "M10 0L40 0L30 40L0 40Z" });
                childNodes.push({ name: options.name + "_event_1", width: 24, height: 24, addInfo: { offset: { x: 0, y: 0 }, hAlign: "left", vAlign: "top", margin: { left: 18, top: 18 } } });
                childNodes.push({ name: options.name + "_event_2", width: 20.4, height: 20.4, addInfo: { offset: { x: 0, y: 0 }, hAlign: "left", vAlign: "top", margin: { left: 18, top: 18 } } });
                childNodes.push({ name: options.name + "_event_3", width: 12, height: 12, addInfo: { offset: { x: 0, y: 0 }, hAlign: "left", vAlign: "top", margin: { left: 18, top: 18 } } });

                for (i = 0; i < childNodes.length; i++)
                    childNodes[i] = ej.datavisualization.Diagram.Node($.extend(true, {}, defaultProperty, childNodes[i]));

                if (options.activity == "subprocess" && !options.subProcess.collapsed && options.subProcess.processes && options.subProcess.processes.length) {
                    for (var j = 0, process = options.subProcess.processes; j < options.subProcess.processes.length; j++) {
                        process[j] = ej.datavisualization.Diagram.Node(ej.datavisualization.Diagram.NodeType(process[j], diagram));
                        childNodes.push(process[j]);
                    }
                }
            }
            options.constraints = options.constraints ? options.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
            options.children = this._updateBPMNActivityShape(options, childNodes);
            for (i = 0; i < options.children.length; i++)
                childTable[options.children[i].name] = options.children[i];
            ej.datavisualization.Diagram.Util._updateBPMNProperties(options, diagram, childTable);
            return options;
        },
        _getBPMNGroupShape: function (options, diagram) {
            var childNodes = [], i = 0;
            if (options.children == undefined) options.children = [];
            for (i = 0; i < options.children.length; i++)
                if (diagram.nameTable[options.children[i].name || options.children[i]])
                    childNodes.push(diagram.nameTable[options.children[i].name || options.children[i]]);
            if (!childNodes.length) {
                for (i = 0; i < options.children.length; i++) {
                    var child = ej.datavisualization.Diagram.Node(ej.datavisualization.Diagram.NodeType(options.children[i], diagram));
                    if (child.type == "bpmn") childNodes.push(child);
                }
            }
            options.ports = [];
            options.children = childNodes;
            options.constraints = options.constraints ? options.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
            options.constraints = options.constraints & ~ej.datavisualization.Diagram.NodeConstraints.Connect | ej.datavisualization.Diagram.NodeConstraints.AllowDrop;;
            return options;
        },

        _updateBPMNEventShape: function (node, childNodes, event, trigger) {
            var constraints;
            if (childNodes && childNodes[0]) {
                constraints = childNodes[0].constraints ? childNodes[0].constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
                if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                    constraints = constraints | ej.datavisualization.Diagram.NodeConstraints.Shadow;
                }
            }
            var defaultPathData = "M164.1884,84.6909000000001C156.2414,84.6909000000001,149.7764,78.2259000000001,149.7764,70.2769000000001C149.7764,62.3279000000001,156.2414,55.8629000000001,164.1884,55.8629000000001C172.1354,55.8629000000001,178.6024,62.3279000000001,178.6024,70.2769000000001C178.6024,78.2259000000001,172.1354,84.6909000000001,164.1884,84.6909000000001";
            var defaultChildNodes = [{ pathData: defaultPathData, fillColor: node.fillColor, constraints: constraints, shadow: node.shadow, borderWidth: node.borderWidth, borderColor: node.borderColor, borderDashArray: "1 0", opacity: node.opacity, gradient: node.gradient, visible: true },
                                     { pathData: defaultPathData, fillColor: node.fillColor, borderColor: node.borderColor, borderDashArray: "1 0", opacity: node.opacity, gradient: node.gradient, visible: true },
                                     { pathData: defaultPathData, fillColor: "white", borderColor: node.borderColor, opacity: node.opacity, height: childNodes[0].height * .5, visible: true }];
            $.extend(true, childNodes, defaultChildNodes);
            switch (event) {
                case "start":
                    childNodes[1].visible = false;
                    break;
                case "noninterruptingstart":
                    childNodes[0].borderDashArray = "2 3";
                    childNodes[1].visible = false;
                    break;
                case "intermediate":
                    childNodes[0].fillColor = "white";
                    childNodes[0].gradient = null;
                    break;
                case "noninterruptingintermediate":
                    childNodes[0].fillColor = "white";
                    childNodes[0].gradient = null;
                    childNodes[0].borderDashArray = "2 3";
                    childNodes[1].borderDashArray = "2 3";
                    break;
                case "throwingintermediate":
                case "end":
                    childNodes[0].fillColor = event != "end" ? "white" : "black";
                    childNodes[0].gradient = null;
                    childNodes[2].fillColor = "black";
                    childNodes[2].borderColor = node.fillColor;
                    break;
            }
            switch (trigger) {
                case ej.datavisualization.Diagram.BPMNTriggers.None:
                    childNodes[2].visible = false;
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Message:
                    childNodes[2].pathData = "M0,0 L19.8,12.8 L40,0 L0, 0 L0, 25.5 L40, 25.5 L 40, 0";
                    childNodes[2].height = 3 * childNodes[2].width / 4;
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Timer:
                    childNodes[2].pathData = "M40,20c0,8.654-5.496,16.024-13.189,18.81" +
                                             "C24.685,39.58,22.392,40,20,40C8.954,40,0,31.046,0,20S8.954,0,20,0S40,8.954,40,20z M20,0 L20,2.583 L20,5.283 M10.027,2.681 L11.659,5.507 L12.669,7.257 M2.731,9.989 L6.014,11.885 L7.307,12.631 M0.067,19.967 L2.667,19.967 L5.35,19.967" +
                                             "M2.748,29.939 L5.731,28.217 L7.323,27.298 M10.056,37.236 L11.292,35.095 L12.698,32.66 M20.033,39.9 L20.033,36.417 L20.033,34.617 M30.006,37.219 L28.893,35.292 L27.364,32.643 M37.302,29.911 L34.608,28.355 L32.727,27.269" +
                                             "M39.967,19.933 L37.417,19.933 L34.683,19.933 M37.286,9.961 L34.583,11.521 L32.71,12.602 M29.977,2.664 L28.653,4.957 L27.336,7.24 M22.104,8.5 L19.688,20 L24.75,20 L31.604,20 L24.75,20 L19.688,20z";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Error:
                    childNodes[2].pathData = "M 23.77 18.527 l -7.107 27.396 l 8.507 -17.247 L 36.94 40.073 l 6.394 -25.997 l -8.497 15.754 L 23.77 18.527 Z";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Escalation:
                    childNodes[2].pathData = "M 30.001 8.098 L 11.842 43.543 l 18.159 -18.882 l 18.162 18.882 L 30.001 8.098 Z ";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Cancel:
                    childNodes[2].pathData = "M 3.5 16 L 0 12.6 L 4.6 8 L 0 3.5 L 3.4 0 L 8 4.6 l 4.5 -4.5 L 16 3.5 L 11.5 8 l 4.5 4.5 l -3.4 3.5 L 8 11.4 L 3.5 16 Z";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Compensation:
                    childNodes[2].pathData = "M 25.7086 0 L 0 25 L 25.7086 50 V 26.3752 L 50 50 V 0 L 25.7086 23.6248 V 0 Z ";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Conditional:
                    childNodes[2].pathData = "M 0 0 H 16 V 16 H 0 z M 1.14 3.2 H 14.85 M 1.14 6.4 H 14.85 M 1.14 9.6 H 14.85 M 1.14 12.8 H 14.85";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Link:
                    childNodes[2].pathData = "M 32.014 19.258 v 5.992 H 9.373 v 9.504 h 22.641 v 5.988 L 50.622 30 L 32.014 19.258 Z";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Signal:
                    childNodes[2].pathData = "M 50 50 H 0 L 25.0025 0 L 50 50 Z";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Terminate:
                    childNodes[2].pathData = "M 25 50 C 11.21 50 0 38.79 0 25 C 0 11.21 11.21 0 25 0 C 38.78 0 50 11.21 50 25 C 50 38.79 38.78 50 25 50";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Multiple:
                    childNodes[2].pathData = "M 17.784 48.889 H 42.21 l 7.548 -23.23 L 29.997 11.303 L 10.236 25.658 L 17.784 48.889 Z";
                    break;
                case ej.datavisualization.Diagram.BPMNTriggers.Parallel:
                    childNodes[2].pathData = "M 27.276 49.986 h 5.58 v -17.15 h 17.146 V 27.17 h -17.15 l 0.004 -17.15 h -5.58 l -0.004 17.15 H 9.994 v 5.666 h 17.278 L 27.276 49.986 Z";
                    break;
            }
            return childNodes;
        },
        _updateBPMNActivityShape: function (node, childNodes) {
            var constraints;
            if (childNodes && childNodes[0]) {
                constraints = childNodes[0].constraints ? childNodes[0].constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
                if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.Shadow) {
                    constraints = constraints | ej.datavisualization.Diagram.NodeConstraints.Shadow;
                }
            }
            var defaultChildNodes = [{ fillColor: node.fillColor, borderWidth: node.borderWidth, constraints: constraints, shadow: node.shadow, borderColor: node.borderColor, borderDashArray: "1 0", opacity: node.opacity, gradient: node.gradient, pathData: this._updateRoundedRectanglePath(node, 12) },
                                    { fillColor: "white", borderColor: "black", width: 14, height: 14, opacity: node.opacity, visible: false },
                                    { addInfo: { margin: { left: 0 } }, opacity: node.opacity, visible: true }, { addInfo: { margin: { left: 0 } }, opacity: node.opacity, visible: true },
                                    { addInfo: { margin: { left: 0 } }, opacity: node.opacity, visible: false }, { addInfo: { margin: { left: 0 } }, opacity: node.opacity, visible: false },
                                    { opacity: node.opacity, visible: false }, { opacity: node.opacity, visible: false }, { opacity: node.opacity, visible: false }];
            var subActivities = [], start = 9, j = 0;
            $.extend(true, childNodes, defaultChildNodes);
            if (node.activity == "subprocess" && !node.subProcess.collapsed && childNodes.length > start && node.subProcess.processes.length)
                subActivities = childNodes.splice(childNodes.length - node.subProcess.processes.length, node.subProcess.processes.length);
            var loop = node.activity == "task" ? node.task.loop : node.subProcess.loop;
            var compensation = node.activity == "task" ? node.task.compensation : node.subProcess.compensation;
            switch (loop) {
                case "none":
                    childNodes[2].visible = false;
                    break;
                case "standard":
                    childNodes[2].pathData = "M 52.002 73.379 c -2.494 -2.536 -6.55 -2.534 -9.043 0 c -1.208 1.228 -1.874 2.861 -1.874 4.598 c 0 1.225 0.337 2.395 0.957 3.411 l -1.167 1.186 l 2.071 0.458 l 2.071 0.458 l -0.45 -2.106 l -0.45 -2.106 l -1.292 1.314 c -1.119 -2.065 -0.842 -4.709 0.877 -6.458 c 2.084 -2.119 5.475 -2.117 7.557 0 c 2.083 2.119 2.083 5.565 0 7.685 c -0.976 0.992 -2.272 1.557 -3.65 1.59 l 0.025 1.068 c 1.65 -0.041 3.2 -0.716 4.368 -1.903 c 1.208 -1.228 1.874 -2.861 1.874 -4.597 C 53.875 76.24 53.209 74.607 52.002 73.379 Z";
                    break;
                case "parallelmultiinstance":
                    childNodes[2].pathData = "M 51.5,69.5 L52.5,69.5 L52.5,84.5 L51.5 84.5 Z M 46.5,69.5 L47.5,69.5 L47.5,84.5 L46.5 84.5 Z M 41.5,69.5 L42.5,69.5 L42.5,84.5 L41.5 84.5 Z  ";
                    break;
                case "sequencemultiinstance":
                    childNodes[2].pathData = "M 40.375,71.5 L 55.375,71.5 L 55.375,72.5 L 40.375,72.5 Z M 40.375,76.5 L 55.375,76.5 L 55.375,77.5 L 40.375,77.5 Z M 40.375,76.5 L 55.375,76.5 L 55.375,77.5 L 40.375,77.5 Z M 40.375,81.5 L 55.375,81.5 L 55.375,82.5 L 40.375,82.5 Z";;
                    break;
            }
            if (compensation)
                childNodes[3].pathData = "M 22.462 18.754 l -6.79 3.92 l 6.79 3.92 V 22.89 l 6.415 3.705 v -7.841 l -6.415 3.705 V 18.754 Z M 28.331 19.701 v 5.947 l -5.149 -2.973 L 28.331 19.701 Z M 21.916 25.647 l -5.15 -2.973 l 5.15 -2.973 V 25.647 Z M 22.275 12.674 c -5.513 0 -9.999 4.486 -9.999 9.999 c 0 5.514 4.486 10.001 9.999 10.001 c 5.514 0 9.999 -4.486 9.999 -10.001 C 32.274 17.16 27.789 12.674 22.275 12.674 Z M 22.275 32.127 c -5.212 0 -9.453 -4.241 -9.453 -9.454 c 0 -5.212 4.241 -9.453 9.453 -9.453 c 5.212 0 9.453 4.241 9.453 9.453 C 31.728 27.887 27.487 32.127 22.275 32.127 Z";
            else
                childNodes[3].visible = false;
            var eventCollections = node.activity == ej.datavisualization.Diagram.BPMNActivity.Task ? node.task.events : node.subProcess.events;
            if (eventCollections && eventCollections.length) {
                for (var i = 0; i < eventCollections.length; i++) {
                    var eventNodes = childNodes.slice(start + i * 3, start + 3 + i * 3);
                    if (!eventNodes.length || eventNodes.length < 3) {
                        var constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.PointerEvents | ej.datavisualization.Diagram.NodeConstraints.Connect | ej.datavisualization.Diagram.NodeConstraints.Resize);
                        var defaultProperty = { parent: node.name, type: "group", constraints: constraints, rotateAngle: node.rotateAngle, _isInternalShape: true, opacity: node.opacity, addInfo: { offset: eventCollections[i].offset }, borderColor: "transparent", labels: [{ offset: { x: 0.5, y: 1 }, verticalAlignment: "top", margin: { top: 2 } }] };
                        eventCollections[i].offset = eventCollections[i].offset || {}
                        eventCollections[i].fillColor = 'transparent';
                        eventCollections[i].offset = ej.datavisualization.Diagram.Point(eventCollections[i].offset.x ? eventCollections[i].offset.x : null, eventCollections[i].offset.y ? eventCollections[i].offset.y : null);
                        eventCollections[i] = ej.datavisualization.Diagram.Node($.extend(true, { name: node.name + "_" + ej.datavisualization.Diagram.Util.randomId() }, ej.datavisualization.Diagram.BPMNEventDefaults, defaultProperty, eventCollections[i]));
                        eventNodes = [{ width: 24, height: 24 }, { width: 20.4, height: 20.4 }, { width: 12, height: 12 }];
                        for (var j = 0; j < eventNodes.length; j++) {
                            var eventDefaultProperty = { parent: eventCollections[i].name, type: "node", shape: "path", rotateAngle: eventCollections[i].rotateAngle, constraints: constraints, _isInternalShape: true, opacity: node.opacity, addInfo: { offset: eventCollections[i].offset } };
                            eventNodes[j] = ej.datavisualization.Diagram.Node($.extend(true, { name: eventCollections[i].name + "_" + ej.datavisualization.Diagram.Util.randomId() }, eventDefaultProperty, eventNodes[j]));
                        }
                        eventCollections[i].children = eventNodes
                    }
                    this._updateBPMNEventShape(node, eventNodes, eventCollections[i].event, eventCollections[i].trigger);
                }
                childNodes = childNodes.concat(eventCollections);
            }
            else
                childNodes.splice(start, childNodes.length - 1);
            if (node.activity == ej.datavisualization.Diagram.BPMNActivity.Task) {
                childNodes[1].visible = true;
                delete childNodes[1]._isService;
                switch (node.task.type) {
                    case "none":
                        childNodes[1].visible = false;
                        break;
                    case "service":
                        childNodes[1].pathData = "M 32.699 20.187 v -4.005 h -3.32 c -0.125 -0.43 -0.292 -0.83 -0.488 -1.21 l 2.373 -2.375 l -2.833 -2.83 l -2.333 2.333 c -0.44 -0.253 -0.9 -0.448 -1.387 -0.595 v -3.32 h -4.003 v 3.32 c -0.46 0.137 -0.89 0.322 -1.3 0.537 l -2.285 -2.275 l -2.833 2.83 l 2.285 2.278 c -0.235 0.42 -0.41 0.847 -0.547 1.307 h -3.33 v 4.005 h 3.33 c 0.148 0.488 0.343 0.955 0.588 1.395 l -2.325 2.325 l 2.822 2.832 l 2.373 -2.382 c 0.392 0.205 0.792 0.37 1.212 0.497 v 3.33 h 4.003 v -3.33 c 0.46 -0.138 0.89 -0.323 1.3 -0.547 l 2.43 2.432 l 2.822 -2.832 l -2.42 -2.422 c 0.222 -0.41 0.4 -0.85 0.535 -1.297 H 32.699 Z M 22.699 21.987 c -2.1 0 -3.803 -1.703 -3.803 -3.803 c 0 -2.1 1.703 -3.803 3.803 -3.803 c 2.1 0 3.803 1.703 3.803 3.803 C 26.502 20.285 24.8 21.987 22.699 21.987 Z";
                        childNodes[1]._isService = true;
                        break;
                    case "receive":
                        childNodes[1].pathData = "M 12.217 12.134 v 13.334 h 20 V 12.134 H 12.217 Z M 30.44 13.007 l -8.223 5.35 l -8.223 -5.35 H 30.44 Z M 13.09 24.594 V 13.459 l 9.127 5.94 l 9.127 -5.94 v 11.135 H 13.09 Z";
                        childNodes[1].height = 12;
                        break;
                    case "send":
                        childNodes[1].pathData = "M 45.7256 3.16055 L 25 23.4017 L 4.27442 3.16055 H 45.7256 Z M 47.8963 46.8413 H 2.10375 V 4.80813 L 25 27.1709 L 47.8963 4.80813 V 46.8413 Z";
                        childNodes[1].height = 12;
                        childNodes[1].fillColor = "black";
                        childNodes[1].borderColor = "white";
                        break;
                    case "instantiatingreceive":
                        childNodes[1].pathData = "M 16.306 17.39 v 8.79 h 13.198 v -8.79 H 16.306 Z M 28.375 17.946 l -5.47 3.558 l -5.47 -3.558 H 28.375 Z M 28.948 25.625 H 16.861 v -7.389 l 6.043 3.931 l 6.043 -3.931 V 25.625 Z M 22.905 11.785 c -5.514 0 -9.999 4.486 -9.999 10 c 0 5.514 4.485 10 9.999 10 s 9.999 -4.486 9.999 -10 C 32.904 16.272 28.419 11.785 22.905 11.785 Z M 22.905 31.239 c -5.212 0 -9.453 -4.241 -9.453 -9.454 c 0 -5.212 4.241 -9.453 9.453 -9.453 s 9.452 4.241 9.452 9.453 C 32.357 26.998 28.117 31.239 22.905 31.239 Z";
                        childNodes[1].width = 20;
                        childNodes[1].height = 20;
                        break;
                    case "manual":
                        childNodes[1].pathData = "M 13.183 15.325 h 2.911 c 0.105 0 0.207 -0.043 0.281 -0.117 c 0.078 -0.074 0.117 -0.176 0.117 -0.281 c 0 -0.753 0.718 -1.362 1.596 -1.362 h 2.579 c -0.117 0.227 -0.191 0.48 -0.195 0.757 c 0 0.433 0.168 0.851 0.46 1.144 c 0.008 0.004 0.015 0.011 0.019 0.015 c -0.289 0.285 -0.475 0.691 -0.479 1.148 c 0 0.433 0.168 0.846 0.46 1.139 c 0.011 0.012 0.023 0.02 0.035 0.032 c -0.301 0.281 -0.491 0.694 -0.495 1.155 c 0 0.432 0.168 0.847 0.46 1.143 c 0.265 0.266 0.612 0.414 0.975 0.414 h 0.839 c 0.027 0.004 0.051 0.012 0.074 0.012 h 8.443 c 0.352 0 0.636 0.344 0.636 0.761 c 0 0.414 -0.285 0.753 -0.636 0.753 h -6.687 c -0.019 0 -0.035 -0.008 -0.051 -0.008 h -2.27 c -0.121 -0.835 -0.667 -1.187 -1.795 -1.187 h -2.158 c -0.223 0 -0.402 0.18 -0.402 0.403 c 0 0.219 0.179 0.398 0.402 0.398 h 2.158 c 0.972 0 1.019 0.203 1.019 0.784 c 0 0.219 0.179 0.399 0.402 0.399 c 0.008 0 0.016 -0.004 0.027 -0.004 c 0.028 0.004 0.055 0.016 0.082 0.016 h 2.56 c 0.34 0.015 0.616 0.343 0.616 0.752 c 0 0.418 -0.285 0.757 -0.636 0.761 h -0.004 h -6.442 c -0.878 0 -1.595 -0.639 -1.595 -1.427 v -0.683 c 0 -0.109 -0.043 -0.211 -0.114 -0.285 c -0.078 -0.074 -0.179 -0.117 -0.285 -0.117 h -0.004 l -2.989 0.027 c -0.223 0 -0.398 0.184 -0.398 0.402 c 0 0.219 0.179 0.395 0.398 0.395 h 0.004 l 2.591 -0.02 v 0.282 c 0 1.229 1.073 2.223 2.391 2.223 h 3.895 c 0.004 0 0.007 0.004 0.011 0.004 h 2.536 c 0.792 0 1.436 -0.698 1.436 -1.561 c 0 -0.273 -0.07 -0.53 -0.188 -0.752 h 5.49 c 0.792 0 1.436 -0.695 1.436 -1.553 c 0 -0.858 -0.644 -1.557 -1.436 -1.557 h -3.566 c 0.121 -0.226 0.199 -0.487 0.199 -0.768 c 0 -0.468 -0.195 -0.882 -0.495 -1.167 c 0.301 -0.285 0.495 -0.698 0.495 -1.163 c 0 -0.456 -0.191 -0.866 -0.483 -1.152 c 0.293 -0.285 0.483 -0.694 0.483 -1.151 c 0 -0.858 -0.647 -1.557 -1.439 -1.557 h -8.373 c -1.167 0 -2.142 0.757 -2.352 1.76 l -2.548 -0.004 c -0.219 0 -0.399 0.18 -0.399 0.403 C 12.784 15.145 12.964 15.325 13.183 15.325 L 13.183 15.325 Z M 21.907 19.707 c -0.191 0 -0.328 -0.094 -0.41 -0.176 c -0.144 -0.145 -0.226 -0.355 -0.226 -0.577 c 0.003 -0.418 0.289 -0.753 0.643 -0.753 h 4.468 c 0.008 0 0.015 -0.004 0.027 -0.008 h 0.051 c 0.351 0 0.636 0.344 0.636 0.761 c 0 0.414 -0.286 0.753 -0.636 0.753 H 21.907 Z M 27.097 16.629 c 0 0.414 -0.286 0.753 -0.64 0.753 h -4.464 c -0.004 0 -0.004 0 -0.004 0 h -0.082 c -0.191 0 -0.328 -0.098 -0.414 -0.18 c -0.14 -0.145 -0.222 -0.352 -0.222 -0.573 c 0 -0.413 0.285 -0.749 0.631 -0.753 h 3.434 c 0 0 0 0 0.004 0 h 1.116 c 0.008 0 0.012 -0.004 0.02 -0.004 C 26.819 15.887 27.097 16.215 27.097 16.629 L 27.097 16.629 Z M 27.097 14.322 c 0 0.41 -0.278 0.737 -0.62 0.749 c -0.008 0 -0.012 0 -0.016 0 h -3.637 c -0.008 0 -0.015 0.004 -0.023 0.004 h -0.886 c -0.004 0 -0.008 0 -0.012 0 c -0.187 0 -0.324 -0.094 -0.406 -0.176 c -0.144 -0.144 -0.226 -0.355 -0.226 -0.577 c 0.003 -0.414 0.293 -0.753 0.643 -0.753 h 4.468 c 0.008 0 0.015 -0.004 0.027 -0.004 h 0.051 C 26.811 13.565 27.097 13.905 27.097 14.322 L 27.097 14.322 Z M 27.097 14.322";
                        childNodes[1].width = 20;
                        break;
                    case "businessrule":
                        childNodes[1].pathData = "M 32.844 13.245 h -0.089 v 0 H 13.764 v -0.015 h -1.009 v 16.989 h 0.095 v 0.011 h 19.716 v -0.011 h 0.278 V 13.245 Z M 31.844 14.229 v 4.185 h -18.08 v -4.185 H 31.844 Z M 18.168 25.306 v 3.938 h -4.404 v -3.938 H 18.168 Z M 13.764 24.322 v -4.923 h 4.404 v 4.923 H 13.764 Z M 19.177 25.306 h 12.667 v 3.938 H 19.177 V 25.306 Z M 19.177 24.322 v -4.923 h 12.667 v 4.923 H 19.177 Z";
                        break;
                    case "user":
                        childNodes[1].pathData = "M 21.762 21.935 c 2.584 0 4.687 -2.561 4.687 -5.703 c 0 -3.147 -2.103 -5.703 -4.687 -5.703 c -1.279 0 -2.475 0.61 -3.363 1.721 c -0.855 1.071 -1.327 2.484 -1.324 3.983 C 17.075 19.374 19.178 21.935 21.762 21.935 L 21.762 21.935 Z M 21.762 11.779 c 1.894 0 3.436 1.995 3.436 4.452 c 0 2.453 -1.541 4.452 -3.436 4.452 c -1.895 0 -3.44 -1.999 -3.44 -4.452 C 18.323 13.774 19.864 11.779 21.762 11.779 L 21.762 11.779 Z M 25.699 21.309 c -0.348 0 -0.626 0.277 -0.626 0.626 c 0 0.344 0.277 0.622 0.626 0.622 c 2.136 0 3.875 1.74 3.875 3.879 c 0 0.272 -0.227 0.498 -0.501 0.498 H 14.447 c -0.274 0 -0.497 -0.223 -0.497 -0.498 c 0 -2.139 1.736 -3.879 3.872 -3.879 c 0.344 0 0.625 -0.277 0.625 -0.622 c 0 -0.348 -0.28 -0.626 -0.625 -0.626 c -2.826 0 -5.124 2.297 -5.124 5.126 c 0 0.965 0.784 1.749 1.748 1.749 h 14.626 c 0.964 0 1.748 -0.784 1.748 -1.749 C 30.822 23.606 28.524 21.309 25.699 21.309 L 25.699 21.309 Z M 22.217 9.832 c 0.448 -0.263 0.924 -0.396 1.419 -0.396 c 1.895 0 3.436 1.995 3.436 4.452 c 0 0.439 -0.048 0.873 -0.143 1.284 c -0.08 0.336 0.128 0.672 0.464 0.751 c 0.048 0.012 0.098 0.019 0.143 0.019 c 0.284 0 0.541 -0.195 0.608 -0.483 c 0.119 -0.506 0.18 -1.034 0.18 -1.571 c 0 -3.147 -2.102 -5.703 -4.687 -5.703 c -0.711 0 -1.419 0.198 -2.054 0.573 c -0.296 0.174 -0.397 0.559 -0.219 0.855 C 21.536 9.911 21.921 10.009 22.217 9.832 L 22.217 9.832 Z M 27.697 18.81 c -0.345 0 -0.626 0.277 -0.626 0.622 c 0 0.348 0.281 0.626 0.626 0.626 c 2.137 0 3.75 1.782 3.75 3.918 c 0 0.07 -0.013 0.141 -0.043 0.205 c -0.14 0.314 0.003 0.684 0.318 0.823 c 0.082 0.037 0.167 0.055 0.253 0.055 c 0.241 0 0.466 -0.141 0.57 -0.373 c 0.101 -0.226 0.153 -0.464 0.153 -0.714 C 32.699 21.15 30.523 18.81 27.697 18.81 L 27.697 18.81 Z M 27.697 18.81";
                        break;
                    case "script":
                        childNodes[1].pathData = "M 22.453 15.04 c 0 0 -1.194 -3.741 2.548 -3.774 c 0 0 2.497 0.126 1.766 4.321 c -0.008 0.043 -0.015 0.086 -0.024 0.13 c -0.806 4.323 -2.516 8.42 -3.193 10.581 h 3.904 c 0 0 0.983 4.581 -2.549 4.968 H 13.292 c 0 0 -3.097 -1.42 -1.517 -5.323 l 3 -10.839 H 11.84 c 0 0 -1.129 -2.902 1.709 -3.806 l 11.425 -0.032 l -0.73 0.355 l -1.193 1.726 L 22.453 15.04 Z M 22.409 12.597 c 0 0 -0.242 0.483 -0.278 0.98 h -9.098 c 0 0 -0.06 -0.871 0.714 -1.041 L 22.409 12.597 Z M 26.341 27.734 c 0 0 -0.13 2.678 -2.226 1.871 c 0 0 -0.823 -0.565 -0.758 -1.855 L 26.341 27.734 Z M 22.905 15.008 c 0 0 0.653 -0.258 0.709 -1.501 c 0 0 0.145 -1.144 1.483 -0.693 c 0 0 0.808 0.355 0.259 2.404 c 0 0 -2.226 8.5 -3.032 10.339 c 0 0 -1.064 2.646 0.096 4.226 h -8.581 c 0 0 -1.806 -0.452 -0.741 -3.613 c 0 0 2.935 -9.549 3.193 -11.162 L 22.905 15.008 Z";
                        break;
                }
                if (node.task.call) childNodes[0].borderWidth = 4;
                if (node.task.compensation && node.task.loop != "none") {
                    childNodes[2].addInfo.margin.left -= childNodes[2].width / 2 + 2;
                    childNodes[3].addInfo.margin.left += childNodes[3].width / 2 + 2;
                }
            }
            else if (node.activity == ej.datavisualization.Diagram.BPMNActivity.SubProcess) {
                var markerX = 0, markerWidth = 0, index = 2;
                if (node.subProcess.collapsed) {
                    childNodes[4].constraints = childNodes[4].constraints | ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
                    childNodes[4].visible = true;
                    childNodes[4].pathData = "M 8.13789 15 H 0 V 0 H 8.13789 V 15 Z M 0.625991 13.75 H 7.51189 V 1.25 H 0.625991 V 13.75 Z M 2.18095 7.03125 L 5.95631 7.03125 L 5.95631 7.46875 L 2.18095 7.46875 Z M 3.8342 3.73 L 4.30369 3.73 L 4.30369 11.2687 L 3.8342 11.2687 Z";
                }
                else {
                    childNodes[4].constraints = childNodes[4].constraints | ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
                    childNodes[4].visible = true;
                    childNodes[4].pathData = "M 8.13789 15 H 0 V 0 H 8.13789 V 15 Z M 0.625991 13.75 H 7.51189 V 1.25 H 0.625991 V 13.75 Z M 2.18095 7.03125 L 5.95631 7.03125 L 5.95631 7.46875 L 2.18095 7.46875 Z M 3.8342 3.73 L 4.30369 3.73 L 4.30369 11.2687 L 3.8342 11.2687 Z";
                    childNodes[0] = $.extend(true, childNodes[0], { marginLeft: -node.paddingLeft, marginRight: -node.paddingRight, marginTop: -node.paddingTop, marginBottom: -node.paddingBottom, minWidth: node.width, minHeight: node.height });
                    node.constraints = node.constraints | ej.datavisualization.Diagram.NodeConstraints.AllowDrop;
                    node.minWidth = node.width;
                    node.minHeight = node.height;
                    while (j < subActivities.length) {
                        if (subActivities[j].type != "bpmn") subActivities.splice(j, 1);
                        j++;
                    }
                    childNodes = childNodes.concat(subActivities);
                }
                switch (node.subProcess.boundary) {
                    case "default":
                        childNodes[0].borderWidth = node.borderWidth;
                        childNodes[0].borderDashArray = "1 0";
                        break;
                    case "call":
                        childNodes[0].borderWidth = node.borderWidth < 4 ? 4 : node.borderWidth;;
                        childNodes[0].borderDashArray = "1 0";
                        break;
                    case "event":
                        childNodes[0].borderWidth = node.borderWidth;
                        childNodes[0].borderDashArray = "2 2";
                        break;
                }
                if (node.subProcess.adhoc) {
                    childNodes[5].visible = true;
                    childNodes[5].pathData = "M 49.832 76.811 v -2.906 c 0 0 0.466 -1.469 1.931 -1.5 c 1.465 -0.031 2.331 1.219 2.897 1.688 s 1.06 0.75 1.526 0.75 c 0.466 0 1.548 -0.521 1.682 -1.208 s 0.083 3.083 0.083 3.083 s -0.76 0.969 -1.859 0.969 c -1.066 0 -1.865 -0.625 -2.464 -1.438 s -1.359 -0.998 -2.064 -0.906 C 50.598 75.467 49.832 76.811 49.832 76.811 Z";
                }
                else if (node.subProcess.type == "event") {
                    childNodes[0].borderWidth = node.borderWidth;
                    childNodes[0].borderDashArray = "2 2";
                    this._updateBPMNEventShape(node, childNodes.slice(6, 9), node.subProcess.event, node.subProcess.trigger);

                }
                else if (node.subProcess.type == "transaction") {
                    var innerRect = { x: 3, y: 3, width: node.width - 3, height: node.height - 3 };
                    childNodes[0].pathData += ej.datavisualization.Diagram.DefautShapes._updateRoundedRectanglePath(innerRect, 12);
                }
                //Reset Marker's postion
                do {
                    if (childNodes[index].visible) {
                        childNodes[index].addInfo.margin.left = markerWidth + childNodes[index].width / 2;
                        markerWidth += childNodes[index].width + 2;
                    }
                    index++;
                } while (index < 6);
                markerWidth -= 2;
                index = 2;
                markerX = markerWidth / 2;
                do {
                    if (childNodes[index].visible)
                        childNodes[index].addInfo.margin.left -= markerX;
                    index++;
                } while (index < 6);
            }
            return childNodes;
        },
        _updateRoundedRectanglePath: function (node, a) {
            var d = "", i = 0;
            var points = [{ x: node.x || 0, y: node.y || 0 }, { x: node.x || 0, y: node.height }, { x: node.width, y: node.height }, { x: node.width, y: node.y || 0 }];
            var vector = [{ x: a, y: a }, { x: a, y: -a }, { x: -a, y: -a }, { x: -a, y: a }];
            for (i = 0; i < points.length; i++) {
                d += !d ? "M" : "L";
                d += (points[i].x + (i % 2 == 0 ? vector[i].x : 0)) + "," + (points[i].y + (i % 2 != 0 ? vector[i].y : 0));
                d += "C" + points[i].x + "," + points[i].y + " " + points[i].x + "," + points[i].y;
                d += " " + (points[i].x + (i % 2 != 0 ? vector[i].x : 0)) + "," + (points[i].y + (i % 2 == 0 ? vector[i].y : 0));
            }
            d += "L" + (points[0].x + vector[0].x) + "," + (points[0].y);
            d += "Z";
            return d;
        },

        initBPMNAnnotationShape: function (options, diagram) {
            var annotationNodes = [], n = 0;
            if (options._annotation && options._annotation.length) {
                while (n < options._annotation.length) {
                    var element = diagram.nameTable[options._annotation[n++]];
                    if (element && element.name.split('annotation_')[0] != options.name) options._annotation.splice(--n, 1);
                    else if (element) annotationNodes.push(element);
                    else break;
                }
            }
            if (options.annotation && options.annotation.text) {
                options = $.extend(false, {}, ej.datavisualization.Diagram.BPMNTextAnnotationDefaults, options);
                if (!annotationNodes.length) {
                    var visibility = ej.datavisualization.Diagram.PortVisibility.Hidden;
                    var portConstraints = ej.datavisualization.Diagram.PortConstraints.None;
                    var ports = [{ offset: { x: 0, y: 0.5 }, name: "left", visibility: visibility, constraints: portConstraints }, { offset: { x: 0.5, y: 0 }, name: "top", visibility: visibility, constraints: portConstraints }, { offset: { x: 1, y: 0.5 }, name: "right", visibility: visibility, constraints: portConstraints }, { offset: { x: 0.5, y: 1 }, name: "bottom", visibility: visibility, constraints: portConstraints }];
                    var name0 = options.name + "annotation_" + ej.datavisualization.Diagram.Util.randomId(), name1 = options.name + "annotation_" + ej.datavisualization.Diagram.Util.randomId();
                    var constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.Connect);
                    var connectorConstraints = ej.datavisualization.Diagram.ConnectorConstraints.Default & ~(ej.datavisualization.Diagram.ConnectorConstraints.DragSourceEnd | ej.datavisualization.Diagram.ConnectorConstraints.Drag);
                    if (options._annotation && options._annotation.length) {
                        name0 = typeof options._annotation[0] == "string" ? options._annotation[0] : options._annotation[0].name;
                        name1 = typeof options._annotation[1] == "string" ? options._annotation[1] : options._annotation[1].name;
                    }
                    else
                        options._annotation = [];
                    annotationNodes.push({ name: name0, labels: [{ text: options.annotation.text }], annotation: options.annotation, type: "bpmn", shape: "annotation", _type: "node", _shape: "path", ports: ports, constraints: constraints, width: options.annotation.width, height: options.annotation.height, _preventStretch: true });
                    annotationNodes.push({ name: name1, labels: [{ readOnly: true }], type: "connector", segments: [{ type: "straight" }], targetDecorator: { shape: "none" }, sourceNode: annotationNodes[0].name, targetNode: options.name, constraints: connectorConstraints, annotation: options.annotation, _isAnnotationLine: true });
                }
                annotationNodes[0].offsetX = options.offsetX + options.annotation.length * Math.cos(-options.annotation.angle * (Math.PI / 180));
                annotationNodes[0].offsetY = options.offsetY + options.annotation.length * Math.sin(-options.annotation.angle * (Math.PI / 180));
                var defaultChildNodes = [{ fillColor: "transparent", borderColor: options.borderColor, rotateAngle: options.rotateAngle, opacity: options.opacity, ports: [] },
                                        { lineColor: options.borderColor, opacity: options.opacity }];
                $.extend(true, annotationNodes, defaultChildNodes);
                var node = diagram.nameTable[annotationNodes[0].name], connector = diagram.nameTable[annotationNodes[1].name];
                if (!node) {
                    node = diagram._getNewNode(annotationNodes[0]);
                    diagram.nameTable[node.name] = node;
                    options._annotation.splice(0, 1, node.name);
                }
                if (!connector) {
                    connector = diagram._getNewConnector(annotationNodes[1]);
                    diagram.nameTable[connector.name] = connector;
                    options._annotation.splice(1, 1, connector.name);
                }
                this.updateBPMNAnnotationShape(connector, node, null, options, diagram);
            }
            return options;
        },
        renderBPMNAnnotationShape: function (node, diagram) {
            if (node._annotation && node._annotation.length) {
                for (var n = 0; n < node._annotation.length; n++) {
                    var element = typeof node._annotation[n] == "string" ? diagram.nameTable[node._annotation[n]] : node._annotation[n];
                    if (element) {
                        diagram.nameTable[element.name] = element;
                        var type = diagram.getObjectType(element);
                        if (type == "node") {
                            ej.datavisualization.Diagram.DiagramContext.renderNode(element, diagram);
                        }
                        else if (type == "connector") {
                            var disableSegmentChange = diagram._disableSegmentChange;
                            diagram._disableSegmentChange = false;
                            diagram._updateEdges(element);
                            diagram._dock(element, diagram.nameTable);
                            ej.datavisualization.Diagram.DiagramContext.renderConnector(element, diagram);
                            diagram._disableSegmentChange = disableSegmentChange;
                        }
                    }
                }
            }
        },
        updateBPMNAnnotationShape: function (element, annotationNode, previousTarget, currentTarget, diagram) {
            if (diagram.getObjectType(element) == "connector" && element._isAnnotationLine) {
                if (previousTarget && diagram.nameTable[previousTarget]) {
                    var prevNode = diagram.nameTable[previousTarget];
                    $.extend(true, prevNode, ej.datavisualization.Diagram.BPMNTextAnnotationDefaults);
                    delete prevNode._annotation;
                }
                if (!currentTarget) currentTarget = diagram.nameTable[element.targetNode];
                var annotationBounds = ej.datavisualization.Diagram.Util.bounds(annotationNode);
                var w = 20, h = 20, targetBounds;
                if (currentTarget) targetBounds = ej.datavisualization.Diagram.Util.bounds(currentTarget);
                else targetBounds = { x: element.targetPoint.x, y: element.targetPoint.y, width: element.lineWidth, height: element.lineWidth };
                var port = "";
                if (annotationBounds.x <= targetBounds.x + targetBounds.width && annotationBounds.x + annotationBounds.width >= targetBounds.x) {
                    if (annotationBounds.y + annotationBounds.height < targetBounds.y) port = "bottom";
                    if (annotationBounds.y > targetBounds.y + targetBounds.height) port = "top";
                }
                if (!port) {
                    if (annotationBounds.x > targetBounds.x + targetBounds.width) port = "left";
                    if (annotationBounds.x + annotationBounds.width < targetBounds.x) port = "right";
                }
                if (!port && !element.annotation.direction) port = "left";
                element.annotation.direction = port;
                annotationNode.labels[0].horizontalAlignment = annotationNode.labels[0].verticalAlignment = annotationNode.labels[0].textAlign = "center";
                switch (element.annotation.direction) {
                    case "left":
                        h = annotationBounds.height;
                        annotationNode.pathData = "M" + w + "," + h + " L0," + h + " L0,0 L" + w + ",0";
                        annotationNode.labels[0].horizontalAlignment = "left";
                        annotationNode.labels[0].textAlign = "left";
                        annotationNode.labels[0].offset = ej.datavisualization.Diagram.Point(0.05, 0.5);
                        break;
                    case "right":
                        h = annotationBounds.height;
                        w = annotationBounds.width - 20;
                        annotationNode.pathData = "M" + w + "," + h + " L" + (w + 20) + "," + h + " L" + (w + 20) + ",0 L" + w + ",0";
                        annotationNode.labels[0].horizontalAlignment = "right";
                        annotationNode.labels[0].textAlign = "right";
                        annotationNode.labels[0].offset = ej.datavisualization.Diagram.Point(0.95, 0.5);
                        break;
                    case "top":
                        w = annotationBounds.width;
                        annotationNode.pathData = "M" + w + "," + h + " L" + w + ",0 L0,0 L0," + h;
                        annotationNode.labels[0].verticalAlignment = "top";
                        annotationNode.labels[0].offset = ej.datavisualization.Diagram.Point(0.5, 0);
                        break;
                    case "bottom":
                        h = annotationBounds.height - 20;
                        w = annotationBounds.width;
                        annotationNode.pathData = "M" + w + "," + h + " L" + w + "," + (h + 20) + " L0," + (h + 20) + " L0," + h;
                        annotationNode.labels[0].verticalAlignment = "bottom";
                        annotationNode.labels[0].offset = ej.datavisualization.Diagram.Point(0.5, 1);
                        break;
                }
                if (diagram.nameTable[element.name]) {
                    var disableSegmentChange = diagram._disableSegmentChange;
                    diagram._disableSegmentChange = false;
                    element.annotation.direction = element.sourcePort = port;
                    diagram._updateEdges(element);
                    diagram._dock(element, diagram.nameTable);
                    diagram._disableSegmentChange = disableSegmentChange;
                }
                ej.datavisualization.Diagram.DiagramContext.update(annotationNode, diagram);
            }
        },
        translateBPMNAnnotationShape: function (node, sw, sh, pivot, diagram) {
            if (node.annotation && node.shape != "annotation") {
                var annotationNodes = [];
                if (node.annotation && node.annotation.text) {
                    node = $.extend(false, {}, ej.datavisualization.Diagram.BPMNTextAnnotationDefaults, node);
                    if (node._annotation && node._annotation.length) {
                        for (var n = 0; n < node._annotation.length; n++)
                            if (diagram.nameTable[node._annotation[n]])
                                annotationNodes.push(diagram.nameTable[node._annotation[n]]);
                        if (annotationNodes.length) {
                            var dx = sw, dy = sh;
                            //pivot is previous offset value
                            if (pivot) {
                                var dx = 0, dy = 0;
                                var matrix = ej.Matrix.identity();
                                if (node.rotateAngle) {
                                    ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                                    ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                                    ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                                }
                                else ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                                var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                                var diffx = node.offsetX - pivot.x, diffy = node.offsetY - pivot.y;
                                var cornerPoints = {
                                    bottom: { x: node.offsetX, y: bounds.y },
                                    left: { x: bounds.x + bounds.width, y: node.offsetY },
                                    top: { x: node.offsetX, y: bounds.y + bounds.height },
                                    right: { x: bounds.x, y: node.offsetY }
                                }
                                var pt = cornerPoints[annotationNodes[0].annotation.direction];
                                var oldPosition = ej.Matrix.transform(matrix, { x: pt.x - diffx, y: pt.y - diffy });
                                if (oldPosition.x != pt.x) dx = pt.x - oldPosition.x;
                                if (oldPosition.y != pt.y) dy = pt.y - oldPosition.y;
                            }
                            diagram._translate(annotationNodes[0], dx, dy, diagram.nameTable);
                        }
                    }
                }
            }
            else if (node.annotation && node.shape == "annotation") {
                var connector;
                for (var i = 0; i < node.outEdges.length; i++) {
                    var edge = diagram.nameTable[node.outEdges[i]];
                    if (edge._isAnnotationLine) {
                        connector = edge;
                        break;
                    }
                }
                if (connector) {
                    var target = node.targetNode ? diagram.nameTable[node.targetNode] : null;
                    this.updateBPMNAnnotationShape(connector, diagram.nameTable[connector.sourceNode], null, target, diagram);
                }
            }
        },
        updateAnnotationProperties: function (element, diagram) {
            if (diagram.getObjectType(element) == "node")
                element = diagram.nameTable[element.outEdges[0]];
            var currentTarget = diagram.nameTable[element.targetNode];
            var annotationNode = diagram.nameTable[element.sourceNode];
            if (currentTarget && annotationNode) {
                element.annotation.angle = ej.datavisualization.Diagram.Util._findAngle({ x: annotationNode.offsetX, y: annotationNode.offsetY }, { x: currentTarget.offsetX, y: currentTarget.offsetY }) * -1;
                element.annotation.length = ej.datavisualization.Diagram.Util.findLength({ x: currentTarget.offsetX, y: currentTarget.offsetY }, { x: annotationNode.offsetX, y: annotationNode.offsetY });
                annotationNode.annotation = currentTarget.annotation = $.extend(false, {}, element.annotation);
                currentTarget._annotation = [element.sourceNode, element.name];
                if (diagram.nodes().indexOf(annotationNode) > -1) {
                    ej.datavisualization.Diagram.Util.removeItem(diagram.nodes(), annotationNode);
                    ej.datavisualization.Diagram.Util.removeItem(diagram.connectors(), element);
                    diagram._nodes = $.extend(true, [], diagram.nodes());
                }
            }
            else if (annotationNode) {
                element.annotation.angle = ej.datavisualization.Diagram.Util._findAngle({ x: annotationNode.offsetX, y: annotationNode.offsetY }, element.targetPoint) * -1;
                element.annotation.length = ej.datavisualization.Diagram.Util.findLength(element.targetPoint, { x: annotationNode.offsetX, y: annotationNode.offsetY });
                annotationNode.annotation = $.extend(false, {}, element.annotation);
                diagram.nodes().push(annotationNode);
                diagram.connectors().push(element);
                diagram._nodes = $.extend(true, [], diagram.nodes());
            }
        },
        updateInlineDecoratorsShape: function (connector, diagram) {
            var node;
            if (connector.shape && connector.shape.type == "bpmn" && connector.shape.flow == "message") {
                if (connector._inlineDecorators.length) {
                    var nodes = connector._inlineDecorators.filter(function (e) { if (e.name == connector.name + "_" + connector.shape.message) return e; });
                    if (nodes.length) node = nodes[0];

                }
                connector._inlineDecorators = [];
                if (connector.shape.message == "initiatingmessage" || connector.shape.message == "noninitiatingmessage") {
                    var position = ej.datavisualization.Diagram.Util._findOffsetOnConnector(connector, { segmentOffset: 0.5 }, 0.5, diagram);
                    var fillColor = connector.shape.message == "noninitiatingmessage" ? "lightgrey" : "white";
                    if (node) {
                        node.offsetX = position.offset.x; node.offsetY = position.offset.y; node.fillColor = fillColor;
                    } else
                        node = ej.datavisualization.Diagram.Node({ name: connector.name + "_" + connector.shape.message, width: 25, height: 15, offsetX: position.offset.x, offsetY: position.offset.y, fillColor: fillColor, shape: "path", pathData: "M0,0 L19.8,12.8 L40,0 L0, 0 L0, 25.5 L40, 25.5 L 40, 0", constraints: ej.datavisualization.Diagram.NodeConstraints.Delete });
                    connector._inlineDecorators.push(node);
                }
            }
            return connector;
        },
        //#endregion
    };
    ej.datavisualization.Diagram.bpmnHelper = {
        resetNodeMargin: function (node, overnode, diagram) {
            var margins = { marginLeft: node.marginLeft, marginRight: node.marginRight, marginTop: node.marginTop, marginBottom: node.marginBottom };
            ej.datavisualization.Diagram.canvasHelper._updateNodeMargin(diagram, node, overnode);
            if (overnode && overnode._type == "group") {
                for (var i = 0; i < overnode.children.length; i++) {
                    var child = typeof overnode.children[i] == "string" ? diagram.nameTable[overnode.children[i]] : overnode.children[i];
                    for (var margin in margins)
                        if (margins[margin] == 0) child[margin] = 0;
                }
            }
        },
        updateCanvas: function (node, diagram) {
            if (!diagram._isUndo) ej.datavisualization.Diagram.canvasHelper._updateNodeMargin(diagram, node, diagram.nameTable[node.parent])
            if (node.container && node.container.type === "canvas") {
                ej.datavisualization.Diagram.canvasHelper._setSize(diagram, node, true);
                this.updateProcessCollection(node, diagram);
                if (node.parent && diagram.nameTable[node.parent]) {
                    var parent = diagram.nameTable[node.parent];
                    this.resetNodeMargin(node, parent, diagram);
                    this.updateCanvas(parent, diagram);
                }
                else {
                    ej.datavisualization.Diagram.canvasHelper._updateNodeMargin(diagram, node, diagram.nameTable[node.parent]);
                }
                if (diagram.nameTable[node.name]) {
                    var disableSegmentChange = diagram._disableSegmentChange;
                    diagram._disableSegmentChange = false;
                    diagram._updateAssociatedConnectorEnds(node, diagram.nameTable);
                    ej.datavisualization.Diagram.DiagramContext.update(node, diagram);
                    diagram._disableSegmentChange = disableSegmentChange;
                }
            }
        },
        updateProcessCollection: function (node, diagram) {
            if (node.shape == "activity" && node.activity == "subprocess") {
                var process = node.subProcess.processes, i = 0;
                var children = diagram._getChildren(node.children);
                while (process && process.length && i < process.length) {
                    if (children.indexOf(process[i].name) == -1)
                        ej.datavisualization.Diagram.Util.removeItem(process, process[i]);
                    else
                        process[i] = diagram.nameTable[process[i++].name];
                }
                for (var i = 0; i < node.children.length; i++) {
                    var child = typeof node.children[i] == "string" ? diagram.nameTable[node.children[i]] : node.children[i];
                    if (!child._isInternalShape && process.indexOf(child) == -1)
                        process.push(child);
                }
            }
        },
        isBPMNContainerChild: function (node, diagram) {
            if (node && node.parent) {
                var parent = diagram.nameTable[node.parent];
                return (parent && parent.type == "bpmn" && parent.shape != "group" && parent.container) ? true : false;
            }
        },
        canMoveOutofBounds: function (diagram, element, ptX, ptY) {
            if (diagram.getObjectType(element) == "connector") {
                if (element.sourceNode || element.targetNode) {
                    var node = diagram.nameTable[element.sourceNode || element.targetNode];
                    if (node && this.isBPMNContainerChild(node, diagram)) {
                        var bpmnContainer = diagram.nameTable[node.parent];
                        var bounds = ej.datavisualization.Diagram.Util.bounds(bpmnContainer);
                        bounds = ej.datavisualization.Diagram.Geometry.rect([bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft]);
                        return ((ptX >= bounds.x + bounds.width || ptX <= bounds.x) || (ptY >= bounds.y + bounds.height || ptY <= bounds.y)) ? false : true;
                    }
                }
            }
            return true;
        },
        canAllowConnection: function (diagram, connectedNode, possibleConnection) {
            var parent = null, element = null;
            if (connectedNode && possibleConnection && possibleConnection.type == "bpmn") {
                if (possibleConnection.parent)
                    parent = diagram.nameTable[possibleConnection.parent];
                if (parent && parent.type == "bpmn" && parent.shape != "group" && connectedNode.parent != possibleConnection.parent)
                    return parent;
                else if (diagram._containsChild(possibleConnection, connectedNode) || diagram._containsChild(connectedNode, possibleConnection))
                    return null;
            }
            return possibleConnection;
        },
        canAllowDropOnContainer: function (node, target) {
            if (target.type != "bpmn" || (node.type == "bpmn" && node.shape != "annotation"))
                return true;
            return false;
        }
    };
})(jQuery, Syncfusion);