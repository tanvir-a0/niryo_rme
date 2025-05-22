const logic_color = "#5281a2";
const loop_color = "#49a563";
const math_color = "#5769a1";
const list_color = "#765da1";

const variable_color = "#ad5a7e";
const function_color = "#9f5ca1";

const arm_color = "#007d17";
const movement_color = "#4f87c0";
const io_color = "#c05150";
const tool_color = "#bf964b";
const utility_color = "#bead76";

const vision_color = "#546e7a";
const conveyor_color = "#00838f";

const sound_color = "#E9967A";

// Logic 

Blockly.Blocks['niryo_ned_try_except'] = {
    init: function () {
        this.appendValueInput("NUMBER_LOOP")
            .setCheck("Number")
            .appendField("Try ");
        this.appendDummyInput()
            .appendField("times");
        this.appendStatementInput("TRY")
        this.appendDummyInput("ON_FAILURE")
            .appendField("On failure, do: ")
            .appendField(new Blockly.FieldDropdown([["CONTINUE"], ["STOP"]]), "ON_FAILURE_SELECT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(logic_color);
        this.setTooltip("Try to execute the specified number of time the chosen block. If failed after x trials, either " +
            "continue the code execution, or stop it. Only one block is allowed in the try/except block, and another try/except is not accepted.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks["switch_case"] = {

    init: function () {
        this.appendValueInput('SWITCH')
        .appendField('Switch');
        
        this.appendValueInput('SEL1')
        .appendField('case');
        this.appendStatementInput('CASE1')
        .appendField('do');
        this.setPreviousStatement(true, "Block");
        this.setNextStatement(true);
        this.setMutator(new Blockly.Mutator(['switch_case_case',
        'switch_case_default']));
        
        this.casesCount_ = 1;
        this.hasDefault_ = false;

        this.setColour(logic_color);
        this.setTooltip("");
        this.setHelpUrl("");
        
    },

    mutationToDom: function () {
        if (!this.casesCount_ && !this.hasDefault_) {
            return null;
        }
        var container = document.createElement('mutation');
        if (this.casesCount_) {
            container.setAttribute('case', this.casesCount_);
        }
        if (this.hasDefault_) {
            container.setAttribute('default', 1);
        }
        return container;
    },

    domToMutation: function (xmlElement) {
        this.casesCount_ = window.parseInt(xmlElement.getAttribute('case'), 10);
        this.hasDefault_ = window.parseInt(xmlElement.getAttribute('default'), 10) > 0;
        
        for (var x = 1; x <= this.casesCount_; x++) {
            var theInput = this.getInput('SEL' + x);
            if (!theInput) {
                this.appendValueInput('SEL' + x)
                        .appendField('case');
                this.appendStatementInput('CASE' + x)
                        .appendField('do');
            }
        }
        if (this.hasDefault_) {
            this.appendStatementInput('DEFAULT')
                    .appendField('default');
        }
    },

    // Load the block achitecture in the editor GUI
    decompose: function (workspace) {
        // load switch_case_value block in the editor GUI
        var containerBlock = workspace.newBlock('switch_case_switch');
        containerBlock.initSvg();

        var connection = containerBlock.getInput('STACK').connection;
        // load case blocks in the editor GUI
        for (var x = 1; x <= this.casesCount_; x++) {
            var caseBlock = workspace.newBlock('switch_case_case');
            caseBlock.initSvg();
            connection.connect(caseBlock.previousConnection);
            connection = caseBlock.nextConnection;
        }

        // load befault block in the editor GUI
        if (this.hasDefault_) {
            var defaultBlock = workspace.newBlock('switch_case_default');
            defaultBlock.initSvg();
            connection.connect(defaultBlock.previousConnection);
        }

        // return the full built block
        return containerBlock;
    },

    // Building the new block from the editor GUI
    compose: function (containerBlock) {
        // Clear the old block

        // Disconnect the 'default' input blocks and remove the inputs.
        if (this.hasDefault_) {
            this.removeInput('DEFAULT');
        }
        this.hasDefault_ = false;

        // Disconnect all the cases input blocks and remove the inputs.
        for (var x = this.casesCount_; x > 0; x--) {
            if (this.getInput('SEL' + x)) {
                this.removeInput('SEL' + x);
            }
            if (this.getInput('CASE' + x)) {
                this.removeInput('CASE' + x);
            }
        }
        this.casesCount_ = 0;


        // Rebuild the block's inputs from saved connections.
        var switchCaseBlock = containerBlock.getInputTargetBlock('STACK');
        while (switchCaseBlock) {
            switch (switchCaseBlock.type) {
                // Rebuild 'case' statemant
                case 'switch_case_case':
                    this.casesCount_++;
                    var ifInput = this.appendValueInput('SEL' + this.casesCount_)
                        .appendField('case');
                    var doInput = this.appendStatementInput('CASE' + this.casesCount_)
                        .appendField('do');

                    // Reconnect any child blocks.
                    if (switchCaseBlock.valueConnection_) {
                        ifInput.connection.connect(switchCaseBlock.valueConnection_);
                    }
                    if (switchCaseBlock.statementConnection_) {
                        doInput.connection.connect(switchCaseBlock.statementConnection_);
                    }
                    break;
                
                // Rebuild 'default' statement
                case 'switch_case_default':
                    this.hasDefault_ = true;
                    var elseInput = this.appendStatementInput('DEFAULT');
                    elseInput.appendField('default');
                    // Reconnect any child blocks.
                    if (switchCaseBlock.statementConnection_) {
                        elseInput.connection.connect(switchCaseBlock.statementConnection_);
                    }
                    break;

                default:
                    throw 'Unknown block type.';
            }
            switchCaseBlock = switchCaseBlock.nextConnection &&
            switchCaseBlock.nextConnection.targetBlock();
        }
    },


    saveConnections: function (containerBlock) {
        // Store a pointer to any connected child blocks.
        var switchCaseBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 1;

        // Read all statements to save them
        while (switchCaseBlock) {
            switch (switchCaseBlock.type) {
                // Save 'case' statement
                case 'switch_case_case':
                    var inputIf = this.getInput('SEL' + x);
                    var inputDo = this.getInput('CASE' + x);

                    switchCaseBlock.valueConnection_ =
                            inputIf && inputIf.connection.targetConnection;
                    switchCaseBlock.statementConnection_ =
                            inputDo && inputDo.connection.targetConnection;
                    x++;
                    break;

                // Save 'default' statement
                case 'switch_case_default':
                    var inputDo = this.getInput('DEFAULT');
                    switchCaseBlock.statementConnection_ =
                            inputDo && inputDo.connection.targetConnection;
                    break;
                default:
                    throw 'Unknown block type.';
            }
            switchCaseBlock = switchCaseBlock.nextConnection &&
            switchCaseBlock.nextConnection.targetBlock();
        }
    }
};

Blockly.Blocks["switch_case_switch"] = {
    // If condition.
    init: function () {
        this.setColour(logic_color);
        this.appendDummyInput()
                .appendField('Switch');
        this.appendStatementInput('STACK');
        this.setInputsInline(false);
        this.contextMenu = false;
    }
};

Blockly.Blocks["switch_case_case"] = {
    // Else-If condition.
    init: function () {
        this.setColour(logic_color);
        this.appendDummyInput()
                .appendField('Case');
        this.setPreviousStatement(true, "Block");
        this.setNextStatement(true);
        this.contextMenu = false;
    }
};

Blockly.Blocks["switch_case_default"] = {
    // Else condition.
    init: function () {
        this.setColour(logic_color);
        this.appendDummyInput()
                .appendField('Default');
        this.setPreviousStatement(true, "Block");
        this.contextMenu = false;
    }
};


// Arm

Blockly.Blocks['niryo_one_set_arm_max_speed'] = {
    init: function () {
        this.appendValueInput("SET_ARM_MAX_SPEED")
            .setCheck("Number")
            .appendField("Set Arm max. speed to");
        this.appendDummyInput()
            .appendField("%");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(arm_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['PinSniryo_one_set_learning_mode'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["Activate", "True"], ["Deactivate", "False"]]), "LEARNING_MODE_VALUE")
            .appendField("learning mode");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(arm_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_calibration_auto'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("New auto calibration");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(arm_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

// Movement

Blockly.Blocks['niryo_one_joints'] = {
    init: function () {
        this.data = 'rad';
        this.appendDummyInput()
            .appendField("Joints");
        this.appendValueInput("j1")
            .setCheck("Number")
            .appendField("j1");
        this.appendValueInput("j2")
            .setCheck("Number")
            .appendField("j2");
        this.appendValueInput("j3")
            .setCheck("Number")
            .appendField("j3");
        this.appendValueInput("j4")
            .setCheck("Number")
            .appendField("j4");
        this.appendValueInput("j5")
            .setCheck("Number")
            .appendField("j5");
        this.appendValueInput("j6")
            .setCheck("Number")
            .appendField("j6");
        this.setInputsInline(true);
        this.setOutput(true, 'niryo_one_joints');
        this.setColour(movement_color);
        this.setTooltip("Represents an object pose");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_move_joints_from_joints'] = {
    init: function () {
        this.appendValueInput("JOINTS")
            .setCheck(["niryo_one_joints", "niryo_one_saved_pose"])
            .appendField("Move joints");
        this.setTooltip("Move joints with an object pose given");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(movement_color);
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_pose'] = {
    init: function () {
        this.data = 'rad';
        this.appendDummyInput()
            .appendField("Pose");
        this.appendValueInput("x")
            .setCheck("Number")
            .appendField("x");
        this.appendValueInput("y")
            .setCheck("Number")
            .appendField("y");
        this.appendValueInput("z")
            .setCheck("Number")
            .appendField("z");
        this.appendValueInput("roll")
            .setCheck("Number")
            .appendField("roll");
        this.appendValueInput("pitch")
            .setCheck("Number")
            .appendField("pitch");
        this.appendValueInput("yaw")
            .setCheck("Number")
            .appendField("yaw");
        this.setInputsInline(true);
        this.setOutput(true, 'niryo_one_pose');
        this.setColour(movement_color);
        this.setTooltip("Represents an object pose");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_move_pose_from_pose'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(
                [["Standard", moveCommandType + "POSE"], ["Try linear", "try_linear_if_possible"], ["Linear", moveCommandType + "LINEAR_POSE"]]),
                "MOVE_POSE_METHOD_SELECT")
        this.appendDummyInput()
            .appendField("Move pose");
        this.appendValueInput("POSE")
            .setCheck(["niryo_one_pose", "niryo_one_saved_pose"])
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(movement_color);
        this.setTooltip("Move pose with an object pose given");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_move_trajectory_from_trajectory'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Move Trajectory");
        this.appendValueInput("TRAJECTORY")
            .setCheck(["niryo_one_saved_trajectory"])
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(movement_color);
        this.setTooltip("Move  given");
        this.setHelpUrl("Move arm following a trajectory");
    }
};

Blockly.Blocks['niryo_one_move_trajectory'] = {
    init: function () {
        this.appendValueInput("LIST")
            .setCheck("Array")
            .appendField("Move Trajectory");
        this.appendValueInput("DIST_SMOOTHING")
            .setCheck("Number")
            .appendField("with dist smoothing (m)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(movement_color);
        this.setTooltip("Move arm following a trajectory");
    }
};

Blockly.Blocks['niryo_one_pick_from_pose'] = {
    init: function () {
        this.appendValueInput("POSE")
            .setCheck("niryo_one_pose")
            .appendField("Pick from pose");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(movement_color);
        this.setTooltip("Pick an object at a pose given");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_place_from_pose'] = {
    init: function () {
        this.appendValueInput("POSE")
            .setCheck("niryo_one_pose")
            .appendField("Place from pose");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(movement_color);
        this.setTooltip("Place an object at a pose given");
        this.setHelpUrl("");
    }
};

const shiftPoseEnum = "ShiftPose.";
const moveCommandType = "MoveCommandType.";

Blockly.Blocks['niryo_one_shift_pose'] = {
    init: function () {
        this.data = 'rad';
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(
                [["Standard", moveCommandType + "SHIFT_POSE"], ["Try linear", "try_linear_if_possible"], ["Linear", moveCommandType + "SHIFT_LINEAR_POSE"]]),
                "SHIFT_POSE_METHOD_SELECT")
        this.appendDummyInput()
            .appendField("Shift");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(
                [["AXIS_X", shiftPoseEnum + "AXIS_X"], ["AXIS_Y", shiftPoseEnum + "AXIS_Y"], ["AXIS_Z", shiftPoseEnum + "AXIS_Z"],
                ["ROT_ROLL", shiftPoseEnum + "ROT_ROLL"], ["ROT_PITCH", shiftPoseEnum + "ROT_PITCH"], ["ROT_YAW", shiftPoseEnum + "ROT_YAW"]]),
                "SHIFT_POSE_AXIS")
            .appendField("by")
        this.appendValueInput("SHIFT_POSE_VALUE")
            .setCheck("Number")
        this.appendDummyInput()
            .appendField("m (or rad)")
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(movement_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};




// I/O

const pinModeEnum = "PinMode.";
const pinStateEnum = "PinState.";


Blockly.Blocks['niryo_one_gpio_select'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(
                [["1A", "'1A'"], ["1B", "'1B'"], ["1C", "'1C'"],
                ["2A", "'2A'"], ["2B", "'2B'"], ["2C", "'2C'"]]), "GPIO_SELECT");
        this.setOutput(true, "niryo_one_gpio_select");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['niryo_one_set_pin_mode'] = {
    init: function () {
        this.appendValueInput("SET_PIN_MODE_PIN")
            .setCheck("niryo_one_gpio_select")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Set Pin");
        this.appendDummyInput()
            .appendField("to mode")
            .appendField(new Blockly.FieldDropdown([["INPUT", pinModeEnum + "INPUT"], ["OUTPUT", pinModeEnum + "OUTPUT"]]), "PIN_MODE_SELECT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_digital_write'] = {
    init: function () {
        this.appendValueInput("DIGITAL_WRITE_PIN")
            .setCheck("niryo_one_gpio_select")
            .appendField("Set Pin");
        this.appendDummyInput()
            .appendField("to state")
            .appendField(new Blockly.FieldDropdown([["HIGH", pinStateEnum + "HIGH"], ["LOW", pinStateEnum + "LOW"]]), "PIN_WRITE_SELECT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_digital_read'] = {
    init: function () {
        this.appendValueInput("DIGITAL_READ_PIN")
            .setCheck("niryo_one_gpio_select")
            .appendField("Get Pin");
        this.appendDummyInput()
            .appendField("state");
        this.setInputsInline(true);
        this.setOutput(true, "niryo_one_gpio_state");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_gpio_state'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("state")
            .appendField(new Blockly.FieldDropdown([["HIGH", pinStateEnum + "HIGH"], ["LOW", pinStateEnum + "LOW"]]), "GPIO_STATE_SELECT");
        this.setOutput(true, "niryo_one_gpio_state");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_sw_select'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["SW1", "'SW1'"], ["SW2", "'SW2'"]]), "SW_SELECT");
        this.setOutput(true, "niryo_one_sw_select");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_set_12v_switch'] = {
    init: function () {
        this.appendValueInput("SET_12V_SWITCH")
            .setCheck("niryo_one_sw_select")
            .appendField("Set 12V Switch");
        this.appendDummyInput()
            .appendField("to state")
            .appendField(new Blockly.FieldDropdown([["HIGH", pinStateEnum + "HIGH"], ["LOW", pinStateEnum + "LOW"]]), "SET_12V_SWITCH_SELECT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks["niryo_one_set_analogic"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Set :")
            .appendField(new Blockly.FieldDropdown([["AO0"], ["AO1"]]), "ANALOGIC_ID")
            .appendField("to")
            .appendField(new Blockly.FieldNumber(0.0, 0, 5, 0.1), "ANALOGIC_VALUE");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["niryo_one_set_digital"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Set :")
            .appendField(
                new Blockly.FieldDropdown([["DO1"], ["DO2"], ["DO3"], ["DO4"]]),
                "DIGITAL_ID"
            )
            .appendField("to")
            .appendField(
                new Blockly.FieldDropdown([["LOW"], ["HIGH"]]),
                "DIGITAL_VALUE"
            );
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

// I/O for Ned2
Blockly.Blocks['niryo_one_gpio_select_analogic'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(
                [["AO1", "'AO1'"], ["AO2", "'AO2'"]]), "GPIO_SELECT");
        this.setOutput(true, "niryo_one_gpio_select_analogic");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_gpio_select_digital'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(
                [["DO1", "'DO1'"], ["DO2", "'DO2'"], ["DO3", "'DO3'"], ["DO4", "'DO4'"]]), "GPIO_SELECT");
        this.setOutput(true, "niryo_one_gpio_select_digital");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks["niryo_one_get_analogic"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get :")
            .appendField(
                new Blockly.FieldDropdown([["AI0"], ["AI1"]]),
                "ANALOGIC_ID"
            );
        this.setOutput(true, "Number");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["niryo_one_get_digital"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get :")
            .appendField(
                new Blockly.FieldDropdown([["DI1"], ["DI2"], ["DI3"], ["DI4"], ["DI5"]]),
                "DIGITAL_ID"
            );
        this.setOutput(true, "Boolean");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

// Tools

Blockly.Blocks['niryo_one_update_tool'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Scan & Update tool");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_grasp_w_tool'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Grasp with Gripper or Vacuum");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_release_w_tool'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Release with Gripper or Vacuum");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_open_gripper'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Open Gripper at speed")
            .appendField(new Blockly.FieldDropdown([["1/5", "100"], ["2/5", "250"], ["3/5", "500"], ["4/5", "750"], ["5/5", "1000"]]), "OPEN_SPEED");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("For Ned 1 and Niryo One");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_ned2_open_gripper'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Open Gripper with torque at")
            .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "OPEN_TORQUE")
            .appendField("%");
        this.appendDummyInput()
            .appendField("and hold torque at")
            .appendField(new Blockly.FieldNumber(20, 0, 100, 1), "OPEN_HOLD_TORQUE")
            .appendField("%");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("For Ned 2");
        this.setHelpUrl("");
        this.setWarningText(null);
    }
};

Blockly.Blocks['niryo_one_close_gripper'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Close Gripper at speed")
            .appendField(new Blockly.FieldDropdown([["1/5", "100"], ["2/5", "250"], ["3/5", "500"], ["4/5", "750"], ["5/5", "1000"]]), "CLOSE_SPEED");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("For Ned 1 and Niryo One");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_ned2_close_gripper'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Close Gripper with")
            .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "CLOSE_TORQUE")
            .appendField("% torque and");
        this.appendDummyInput()
            .appendField("and")
            .appendField(new Blockly.FieldNumber(50, 0, 100, 1), "CLOSE_HOLD_TORQUE")
            .appendField("% holding torque");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("For Ned 2");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_pull_air_vacuum_pump'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Pull air with Vacuum Pump");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_push_air_vacuum_pump'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Push air with Vacuum Pump");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_setup_electromagnet'] = {
    init: function () {
        this.appendValueInput("SETUP_ELECTROMAGNET_PIN")
            .setCheck(["niryo_one_gpio_select", "niryo_one_gpio_select_analogic", "niryo_one_gpio_select_digital"])
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Setup Electromagnet with pin");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_activate_electromagnet'] = {
    init: function () {
        this.appendValueInput("ACTIVATE_ELECTROMAGNET_PIN")
            .setCheck(["niryo_one_gpio_select", "niryo_one_gpio_select_analogic", "niryo_one_gpio_select_digital"])
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Activate Electromagnet with pin");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_deactivate_electromagnet'] = {
    init: function () {
        this.appendValueInput("DEACTIVATE_ELECTROMAGNET_PIN")
            .setCheck(["niryo_one_gpio_select", "niryo_one_gpio_select_analogic", "niryo_one_gpio_select_digital"])
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Deactivate Electromagnet with pin");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_enable_tcp'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["Activate", "True"], ["Deactivate", "False"]]), "ENABLE_TCP_VALUE")
            .appendField("TCP");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_set_tcp'] = {
    init: function () {
        this.appendValueInput("SET_TCP_VALUE")
            .setCheck("niryo_one_pose")
            .appendField("Set TCP to");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(tool_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

// Utility

Blockly.Blocks['niryo_one_sleep'] = {
    init: function () {
        this.appendValueInput("SLEEP_TIME")
            .setCheck("Number")
            .appendField("Wait for ");
        this.appendDummyInput()
            .appendField("seconds");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(utility_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_comment'] = {
    init: function () {
        var validator = function (newValue) {
            for (var char_index = 0; char_index < newValue.length; char_index++) {
                if (newValue.charCodeAt(char_index) > 127) {
                    return null;
                }
            }
            return newValue;
        };

        this.appendDummyInput()
            .appendField("Comment :")
            .appendField(new Blockly.FieldTextInput("", validator), "COMMENT_TEXT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(utility_color);
        this.setTooltip("This block will not be executed.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['niryo_one_break_point'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Break Point");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(utility_color);
        this.setTooltip("Stop the execution of the program. Press 'Play' to resume.");
        this.setHelpUrl("");
    }
};

// Vision

const colorEnum = "ObjectColor.";
const shapeEnum = "ObjectShape.";

Blockly.Blocks['niryo_one_vision_color'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Color")
            .appendField(new Blockly.FieldDropdown([["RED", colorEnum + "RED"],
            ["GREEN", colorEnum + "GREEN"],
            ["BLUE", colorEnum + "BLUE"],
            ["ANY", colorEnum + "ANY"]]), "COLOR_SELECT");
        this.setOutput(true, "niryo_one_vision_color");
        this.setColour(vision_color);
        this.setTooltip("Color object (must be used with Vision's blocks)");
    }
}

Blockly.Blocks['niryo_one_vision_shape'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Shape")
            .appendField(new Blockly.FieldDropdown([["SQUARE", shapeEnum + "SQUARE"],
            ["CIRCLE", shapeEnum + "CIRCLE"],
            ["OBJECT", shapeEnum + "ANY"]]), "SHAPE_SELECT");
        this.setOutput(true, "niryo_one_vision_shape");
        this.setColour(vision_color);
        this.setTooltip("Shape object (must be used with Vision's blocks)");
    }
}


Blockly.Blocks['niryo_one_vision_pick'] = {
    init: function () {
        this.appendValueInput("COLOR_SWITCH")
            .setCheck("niryo_one_vision_color")
            .appendField("Vision pick");

        this.appendValueInput("SHAPE_SWITCH")
            .setCheck("niryo_one_vision_shape");
        this.appendDummyInput();

        this.appendValueInput("WORKSPACE")
            .setCheck(["niryo_one_workspace", "String"]);
        this.appendDummyInput();

        this.appendValueInput("HEIGHT_OFFSET")
            .setCheck("Number")
            .appendField("with height offset (mm)");

        this.setOutput(true, "Boolean");
        this.setColour(vision_color);
        this.setHelpUrl("");
        this.setTooltip("Pick an object of SHAPE / COLOR  given, with gripper close position at HEIGHT_OFFSET cm.");
        this.setInputsInline(false);
    }
}

Blockly.Blocks['niryo_one_vision_pick_w_pose'] = {
    init: function () {

        this.appendValueInput("COLOR_SWITCH")
            .setCheck("niryo_one_vision_color")
            .appendField("Vision pick");

        this.appendValueInput("SHAPE_SWITCH")
            .setCheck("niryo_one_vision_shape");
        this.appendDummyInput();

        this.appendValueInput("OBSERVATION_POSE")
            .setCheck("niryo_one_pose")
            .appendField("From Observation pose");

        this.appendValueInput("WORKSPACE")
            .setCheck(["niryo_one_workspace", "String"]);
        this.appendDummyInput();

        this.appendValueInput("HEIGHT_OFFSET")
            .setCheck("Number")
            .appendField("with height offset (mm)");

        this.setOutput(true, "Boolean");
        this.setColour(vision_color);
        this.setHelpUrl("");
        this.setTooltip("Pick an object of SHAPE / COLOR  given, with gripper close position at HEIGHT_OFFSET cm.");
        this.setInputsInline(false);
    }
}

Blockly.Blocks['niryo_one_vision_is_object_detected'] = {
    init: function () {
        this.appendValueInput("COLOR_SWITCH")
            .setCheck("niryo_one_vision_color")
            .appendField("Is object detected");

        this.appendValueInput("SHAPE_SWITCH")
            .setCheck("niryo_one_vision_shape");
        this.appendDummyInput();

        this.appendValueInput("WORKSPACE")
            .setCheck(["niryo_one_workspace", "String"]);
        this.appendDummyInput();

        this.setOutput(true, "Boolean");
        this.setColour(vision_color);
        this.setHelpUrl("");
        this.setTooltip("Detect is there is an object of SHAPE / COLOR in the WORKSPACE given.");
        this.setInputsInline(false);
    }
}

// Dynamic frames
Blockly.Blocks['niryo_move_in_frame'] = {
    init: function () {
        this.appendValueInput("FRAME").setCheck(['String', 'niryo_frame']);  
        //this.appendDummyInput();

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(
                [["Standard", moveCommandType + "POSE"], ["Try linear", "try_linear_if_possible"], ["Linear", moveCommandType + "LINEAR_POSE"]]),
                "MOVE_POSE_METHOD_SELECT")

        this.appendValueInput("POSE")
        .setCheck("niryo_one_pose")
        .appendField("Move to");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(vision_color);
        this.setHelpUrl("");
        this.setTooltip("Move into the FRAME to the given POSE.");
        this.setInputsInline(false);
    }
}

Blockly.Blocks['niryo_move_relative'] = {
    init: function () {
        this.data = 'rad';
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(
                [["Standard", moveCommandType + "POSE"], ["Try linear", "try_linear_if_possible"], ["Linear", moveCommandType + "LINEAR_POSE"]]),
                "MOVE_POSE_METHOD_SELECT")
                
        this.appendDummyInput()
            .appendField("Move relative :");

        this.appendValueInput("x")
            .setCheck("Number")
            .appendField("x");

        this.appendValueInput("y")
            .setCheck("Number")
            .appendField("y");

        this.appendValueInput("z")
            .setCheck("Number")
            .appendField("z");

        this.appendValueInput("roll")
            .setCheck("Number")
            .appendField("roll");

        this.appendValueInput("pitch")
            .setCheck("Number")
            .appendField("pitch");

        this.appendValueInput("yaw")
            .setCheck("Number")
            .appendField("yaw");

        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(vision_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks['niryo_block_frame'] = {
    init: function () {
        this.appendValueInput("FRAME")
            .setCheck(["niryo_frame", "String"])
            .appendField("Frame:");

        this.appendStatementInput("STATEMENTS");
        /*this.appendDummyInput("ON_FAILURE")
            .appendField("On failure, do: ")
            .appendField(new Blockly.FieldDropdown([["CONTINUE"], ["STOP"]]), "ON_FAILURE_SELECT");*/
            
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(vision_color);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

// Conveyor

const conveyorDirectionEnum = "ConveyorDirection.";
const conveyorIdEnum = "ConveyorID.";

Blockly.Blocks['niryo_one_conveyor_models'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["Conveyor 1", conveyorIdEnum + "ID_1"],
            ["Conveyor 2", conveyorIdEnum + "ID_2"]]), "CONVEYOR_SELECT");
        this.setOutput(true, "niryo_one_conveyor_models");

        this.setColour(conveyor_color);
        this.setHelpUrl("");
        this.setTooltip("Conveyors available with Niryo's robot.");
    }
}

Blockly.Blocks['niryo_one_conveyor_use'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Use conveyor");

        this.setColour(conveyor_color);
        this.setHelpUrl("");
        this.setTooltip("Allow the conveyor to be controlled via Niryo's robot.");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
}

Blockly.Blocks['niryo_one_conveyor_control'] = {
    init: function () {
        this.appendValueInput("CONVEYOR_SWITCH")
            .setCheck("niryo_one_conveyor_models")
            .appendField("Control conveyor:");

        this.appendValueInput("SPEED_PERCENT")
            .setCheck("Number")
            .appendField("with speed (%):")

        this.appendDummyInput()
            .appendField("in direction:")
            .appendField(new Blockly.FieldDropdown([["FORWARD", conveyorDirectionEnum + "FORWARD"],
            ["BACKWARD", conveyorDirectionEnum + "BACKWARD"]]), "DIRECTION_SELECT");

        this.setColour(conveyor_color);
        this.setHelpUrl("");
        this.setTooltip("Control the conveyor given.");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(false);
    }
}

Blockly.Blocks['niryo_one_conveyor_stop'] = {
    init: function () {
        this.appendValueInput("CONVEYOR_SWITCH")
            .setCheck("niryo_one_conveyor_models")
            .appendField("Stop conveyor");

        this.setColour(conveyor_color);
        this.setHelpUrl("");
        this.setTooltip("Stop the conveyor given.");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
}

// Sound
Blockly.Blocks["sound_volume"] = {
    init: function () {
        this.appendDummyInput().appendField("Set the sound volume to ");
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "VOLUME")
            .appendField("%");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["stop_sound"] = {
    init: function () {
        this.appendDummyInput().appendField("Stop sound");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

// Light 
Blockly.Blocks["led_ring_none"] = {
    init: function () {
        this.appendDummyInput().appendField("Led Ring - None");

        this.setColour(sound_color);
        this.setHelpUrl("");
        this.setTooltip("Led ring no animation, turn off all Leds.");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
};

Blockly.Blocks["led_ring_solid"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Solid");
        this.appendValueInput("COLOR")
            .appendField("Color:")
            .setCheck("led_ring_color");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring solid animation, set the whole Led Ring to a fixed color. If wait is True, the blocks wait for the animation to finish."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_chase"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Chase");
        this.appendValueInput("COLOR")
            .appendField("Color:")
            .setCheck("led_ring_color");
        this.appendDummyInput()
            .appendField("Pattern duration (s)")
            .appendField(new Blockly.FieldNumber(1, 0.1, 1000, 0.1), "PERIOD");
        this.appendDummyInput()
            .appendField("Repetitions")
            .appendField(new Blockly.FieldNumber(1, 0, 1000, 1), "ITERATIONS");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring chase animation, movie theater light style chaser animation. If wait is True and iterations not null, the blocks wait for the animation to finish." +
            "If iterations is null, the animation is endless and the block returns immediately."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_flashing"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Flashing");
        this.appendValueInput("COLOR")
            .appendField("Color:")
            .setCheck("led_ring_color");
        this.appendDummyInput()
            .appendField("Pattern duration (s)")
            .appendField(new Blockly.FieldNumber(1, 0.1, 1000, 0.1), "PERIOD");
        this.appendDummyInput()
            .appendField("Repetitions")
            .appendField(new Blockly.FieldNumber(1, 0, 1000, 1), "ITERATIONS");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring flashing animation, flashes a color according to a frequency. If wait is True and iterations not null, the blocks wait for the animation to finish." +
            "If iterations is null, the animation is endless and the block returns immediately."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_wipe"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Wipe");
        this.appendValueInput("COLOR")
            .appendField("Color:")
            .setCheck("led_ring_color");
        this.appendDummyInput()
            .appendField("Pattern duration (s)")
            .appendField(new Blockly.FieldNumber(1, 0.1, 1000, 0.1), "PERIOD");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring wipe animation, wipe a color across the Led Ring, light a Led at a time. If wait is True, the blocks wait for the animation to finish."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_rainbow"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Rainbow");
        this.appendDummyInput()
            .appendField("Pattern duration (s)")
            .appendField(new Blockly.FieldNumber(1, 0.1, 1000, 0.1), "PERIOD");
        this.appendDummyInput()
            .appendField("Repetitions")
            .appendField(new Blockly.FieldNumber(1, 0, 1000, 1), "ITERATIONS");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring rainbow animation, draw rainbow that fades across all Leds at once. If wait is True and iterations not null, the blocks wait for the animation to finish." +
            "If iterations is null, the animation is endless and the block returns immediately."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_rainbow_cycle"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Rainbow Cycle");
        this.appendDummyInput()
            .appendField("Pattern duration (s)")
            .appendField(new Blockly.FieldNumber(1, 0.1, 1000, 0.1), "PERIOD");
        this.appendDummyInput()
            .appendField("Repetitions")
            .appendField(new Blockly.FieldNumber(1, 0, 1000, 1), "ITERATIONS");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring rainbow cycle animation, draw rainbow that uniformly distributes itself across all Leds. If wait is True and iterations not null, the blocks wait for the animation to finish." +
            "If iterations is null, the animation is endless and the block returns immediately."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_rainbow_chase"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Rainbow Chase");
        this.appendDummyInput()
            .appendField("Pattern duration (s)")
            .appendField(new Blockly.FieldNumber(1, 0.1, 1000, 0.1), "PERIOD");
        this.appendDummyInput()
            .appendField("Repetitions")
            .appendField(new Blockly.FieldNumber(1, 0, 1000, 1), "ITERATIONS");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring rainbow chase animation, like the chase animation. If wait is True and iterations not null, the blocks wait for the animation to finish." +
            "If iterations is null, the animation is endless and the block returns immediately."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_go_up"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Go up");
        this.appendValueInput("COLOR")
            .appendField("Color:")
            .setCheck("led_ring_color");
        this.appendDummyInput()
            .appendField("Pattern duration (s)")
            .appendField(new Blockly.FieldNumber(1, 0.1, 1000, 0.1), "PERIOD");
        this.appendDummyInput()
            .appendField("Repetitions")
            .appendField(new Blockly.FieldNumber(1, 0, 1000, 1), "ITERATIONS");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring go up animation, Leds turn on like a loading circle, and are then all turned off at once. If wait is True and iterations not null, the blocks wait for the animation to finish." +
            "If iterations is null, the animation is endless and the block returns immediately."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_go_down"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Go down");
        this.appendValueInput("COLOR")
            .appendField("Color:")
            .setCheck("led_ring_color");
        this.appendDummyInput()
            .appendField("Pattern duration (s)")
            .appendField(new Blockly.FieldNumber(1, 0.1, 1000, 0.1), "PERIOD");
        this.appendDummyInput()
            .appendField("Repetitions")
            .appendField(new Blockly.FieldNumber(1, 0, 1000, 1), "ITERATIONS");
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldDropdown([["True"], ["False"]]), "WAIT");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip(
            "Led ring go down animation, Leds turn on like a loading circle, and are turned off the same way. If wait is True and iterations not null, the blocks wait for the animation to finish." +
            "If iterations is null, the animation is endless and the block returns immediately."
        );
        this.setHelpUrl("");
    },
};

Blockly.Blocks["set_led_color"] = {
    init: function () {
        this.appendDummyInput().appendField("Led ring - Set led");
        this.appendValueInput("LED_ID")
            .appendField("id:")
            .setCheck("Number");
        this.appendValueInput("COLOR")
            .appendField("to color:")
            .setCheck("led_ring_color");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(sound_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["led_ring_color_block"] = {
    init: function () {
        let rField = new Blockly.FieldNumber(15, 0, 255, 1);
        let gField = new Blockly.FieldNumber(50, 0, 255, 1);
        let bField = new Blockly.FieldNumber(255, 0, 255, 1);
        let hexField = new Blockly.FieldColour(this.rgbToHex(15, 50, 255));
        
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField("R:")
            .appendField(rField, "RED")
        this.appendDummyInput()
            .appendField("G:")
            .appendField(gField, "GREEN");
        this.appendDummyInput()
            .appendField("B:")
            .appendField(bField, "BLUE");
        this.appendDummyInput("colorInput")
            .appendField("Color:")
            .appendField(hexField, "COLOR");
        this.setOutput(true, "led_ring_color");
        this.setColour(sound_color);
        this.setTooltip("Led's color");

        rField.setValidator(this.redValidator.bind(this));
        gField.setValidator(this.greenValidator.bind(this));
        bField.setValidator(this.blueValidator.bind(this));
        hexField.setValidator(this.rgbHexValidator.bind(this));
    },

    redValidator: function(red) {
        let rgb_hex = this.rgbToHex(red, this.getField('GREEN').getValue(), this.getField('BLUE').getValue());
        this.getField("COLOR").setValue(rgb_hex);
    },

    greenValidator: function(green) {
        let rgb_hex = this.rgbToHex(this.getField('RED').getValue(), green, this.getField('BLUE').getValue());
        this.getField("COLOR").setValue(rgb_hex);
    },

    blueValidator: function(blue) {
        let rgb_hex = this.rgbToHex(this.getField('RED').getValue(), this.getField('GREEN').getValue(), blue);
        this.getField("COLOR").setValue(rgb_hex);
    },

    rgbHexValidator: function(hex_rgb) {
        let rgb = this.hexToRgb(hex_rgb);
        this.getField("RED").setValue(rgb.r);
        this.getField("GREEN").setValue(rgb.g);
        this.getField("BLUE").setValue(rgb.b);
    },

    rgbToHex: function(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },

    componentToHex: function(c) {
        var hex = Number(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },

    hexToRgb: function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            } : null;
    }
};

const buttonActionEnum = "ButtonAction.";

Blockly.Blocks['custom_button_state'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Button")
            .appendField(new Blockly.FieldDropdown([
                ["Simple press", buttonActionEnum + "SINGLE_PUSH_ACTION"],
                ["Double press", buttonActionEnum + "DOUBLE_PUSH_ACTION"],
                ["Long press", buttonActionEnum + "LONG_PUSH_ACTION"],
                ["Any press", buttonActionEnum + "HANDLE_HELD_ACTION"],
                ["Nothing", buttonActionEnum + "NO_ACTION"]]), "CUSTOM_BUTTON_ACTION_SELECT");
        this.setOutput(true, "custom_button_state");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks['is_button_pressed'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("is button pressed")

        this.setOutput(true, "Boolean");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks['wait_for_button_action'] = {
    init: function () {
        this.appendValueInput("BUTTON_ACTION_SWITCH")
            .setCheck("custom_button_state")
            .appendField("Waiting for");
        this.appendDummyInput()
            .appendField("with timeout:")
            .appendField(new Blockly.FieldNumber(0, 0, 1000, 0.1), "TIMEOUT")
            .appendField("s");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks['get_and_wait_for_button_action'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get button action with timeout:")
            .appendField(new Blockly.FieldNumber(0, 0, 1000, 0.1), "TIMEOUT")
            .appendField("s");

        this.setOutput(true, "custom_button_state");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["button_press_duration"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get custom button press duration with timeout:")
            .appendField(new Blockly.FieldNumber(0, 0, 1000, 0.1), "TIMEOUT")
            .appendField("s");
        this.setOutput(true, "Number");
        this.setColour(io_color);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};