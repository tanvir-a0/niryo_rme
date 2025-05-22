// This generator is used by Blockly https://developers.google.com/blockly
// Find ORDERS at https://searchcode.com/codesearch/view/98685652/

function generateCode(func_name, paramsArray, unpack = false, command_end = '\n') {
  let command = 'n.' + func_name + '('
  if (unpack) {
    command += '*'
  }
  const arrayLength = paramsArray.length;
  for (let i = 0; i < arrayLength; i++) {
    if (i > 0) {
      command += ', '
    }
    command += paramsArray[i]
  }
  command += ')'
  return command + command_end
}

// Transform Color Hexa format to RGB format
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

// Logic

Blockly.Python['niryo_ned_try_except'] = function (block) {
  let dropdown_try_except = block.getFieldValue('ON_FAILURE_SELECT');
  let number_loop = Blockly.Python.valueToCode(block, 'NUMBER_LOOP', Blockly.Python.ORDER_MEMBER)
  var tryblock = Blockly.Python.statementToCode(block, 'TRY');
  var commandStatement = ""

  if (tryblock.length > 0) {
    tryblock = tryblock.trim()
    commandStatement = tryblock.split('\n');
  }

  command = 'if ' + commandStatement.length + ' <= 2 and ' + number_loop + ' > 0: \n'
  command += '  for i in range(' + number_loop + '): \n'
  command += '    try: \n'
  command += '    ' + commandStatement[1] + '\n'
  command += '      break \n'
  command += '    except NiryoRosWrapperException as e:' + '\n'
  command += '      pass \n';
  command += '      n.wait(0.2) \n'
  command += '  else: \n'
  command += '    if "' + dropdown_try_except + '" == "STOP" : \n'
  command += '      raise NiryoRosWrapperException("Warning: Block Stopped") \n'
  command += '    elif "' + dropdown_try_except + '" == "CONTINUE" : \n'
  command += '      pass \n'
  command += 'else: \n'
  command += '  raise NiryoRosWrapperException("Warning: One block allowed on the Try/Except") \n'

  return command
};


Blockly.Python["switch_case"] = function (block) {

  var start = Blockly.Python.valueToCode(block, 'SWITCH', Blockly.Python.ORDER_MEMBER) || '0';

  var argument = '';
  var branch = '';

  var code = 'niryo_switch_case_value = ' + start + '\n';

  var n = 1;
  if (block.casesCount_ > 0) {
    argument = Blockly.Python.valueToCode(block, 'SEL' + n, Blockly.Python.ORDER_MEMBER) || '0';
    branch = Blockly.Python.statementToCode(block, 'CASE' + n);
    code += 'if niryo_switch_case_value == ' + argument + ':\n' + branch;
  }

  for (n = 2; n <= block.casesCount_; n++) {
    argument = Blockly.Python.valueToCode(block, 'SEL' + n, Blockly.Python.ORDER_MEMBER) || '0';
    branch = Blockly.Python.statementToCode(block, 'CASE' + n);
    code += 'elif niryo_switch_case_value == ' + argument + ':\n' + branch;
  }

  if (block.hasDefault_) {
    branch = Blockly.Python.statementToCode(block, 'DEFAULT');
    code += 'else: \n' + branch + '\n';
  }
  return code + '\n';
};

// Arm

Blockly.Python['niryo_one_set_arm_max_speed'] = function (block) {
  let value_set_arm_max_speed = Blockly.Python.valueToCode(block, 'SET_ARM_MAX_SPEED');
  return generateCode('set_arm_max_velocity', [value_set_arm_max_speed]);
};

Blockly.Python['PinSniryo_one_set_learning_mode'] = function (block) {
  let dropdown_learning_mode_value = block.getFieldValue('LEARNING_MODE_VALUE');
  return generateCode('set_learning_mode', [dropdown_learning_mode_value]);
};

Blockly.Python['niryo_one_calibration_auto'] = function (block) {
  return generateCode('request_new_calibration', []) + generateCode('calibrate_auto', []);
};

// Movement

Blockly.Python['niryo_one_joints'] = function (block) {
  let value_j1 = Blockly.Python.valueToCode(block, 'j1', Blockly.Python.ORDER_MEMBER).replace(/[\])}[{(]/g, '');
  let value_j2 = Blockly.Python.valueToCode(block, 'j2', Blockly.Python.ORDER_MEMBER).replace(/[\])}[{(]/g, '');
  let value_j3 = Blockly.Python.valueToCode(block, 'j3', Blockly.Python.ORDER_MEMBER).replace(/[\])}[{(]/g, '');
  let value_j4 = Blockly.Python.valueToCode(block, 'j4', Blockly.Python.ORDER_MEMBER).replace(/[\])}[{(]/g, '');
  let value_j5 = Blockly.Python.valueToCode(block, 'j5', Blockly.Python.ORDER_MEMBER).replace(/[\])}[{(]/g, '');
  let value_j6 = Blockly.Python.valueToCode(block, 'j6', Blockly.Python.ORDER_MEMBER).replace(/[\])}[{(]/g, '');

  // convert deg to rad
  if (block.data == 'deg') {
    value_j1 = THREE.Math.degToRad(value_j1).toFixed(3);
    value_j2 = THREE.Math.degToRad(value_j2).toFixed(3);
    value_j3 = THREE.Math.degToRad(value_j3).toFixed(3);
    value_j4 = THREE.Math.degToRad(value_j4).toFixed(3);
    value_j5 = THREE.Math.degToRad(value_j5).toFixed(3);
    value_j6 = THREE.Math.degToRad(value_j6).toFixed(3);
  }

  let code = "[" + value_j1 + ", " + value_j2 + ", " + value_j3 + ", " + value_j4 + ", " + value_j5 + ", " + value_j6 + "]";
  return [code, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_one_move_joints_from_joints'] = function (block) {
  let value_joints = Blockly.Python.valueToCode(block, 'JOINTS', Blockly.Python.ORDER_MEMBER);

  return generateCode("move_joints", [value_joints], true);
}

Blockly.Python["niryo_one_saved_pose"] = function (block) {
  let saved_pose_name = block.getFieldValue('SAVED_POSE_SELECTOR');
  return [generateCode("get_pose_saved", ['"' + saved_pose_name + '"'], false, command_end = '') + "", Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_one_pose'] = function (block) {
  let value_x = Blockly.Python.valueToCode(block, 'x');
  let value_y = Blockly.Python.valueToCode(block, 'y');
  let value_z = Blockly.Python.valueToCode(block, 'z');

  let value_roll = Blockly.Python.valueToCode(block, 'roll').replace(/[\])}[{(]/g, '');
  let value_pitch = Blockly.Python.valueToCode(block, 'pitch').replace(/[\])}[{(]/g, '');
  let value_yaw = Blockly.Python.valueToCode(block, 'yaw').replace(/[\])}[{(]/g, '');

  // convert deg to rad
  if (block.data == 'deg') {
    value_roll = THREE.Math.degToRad(value_roll).toFixed(3);
    value_pitch = THREE.Math.degToRad(value_pitch).toFixed(3);
    value_yaw = THREE.Math.degToRad(value_yaw).toFixed(3);
  }


  let code = "[" + value_x + ", " + value_y + ", " + value_z + ", " + value_roll + ", " + value_pitch + ", " + value_yaw + "]";
  return [code, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_one_move_pose_from_pose'] = function (block) {
  let dropdown_move_pose_method = block.getFieldValue('MOVE_POSE_METHOD_SELECT');
  // Position object
  let value_pose = Blockly.Python.valueToCode(block, 'POSE', Blockly.Python.ORDER_MEMBER);

  if (dropdown_move_pose_method == "MoveCommandType.POSE") {
    return generateCode("move_pose", [value_pose], true);
  }
  else if (dropdown_move_pose_method == "MoveCommandType.LINEAR_POSE") {
    return generateCode("move_linear_pose", [value_pose], true);
  }
  else if (dropdown_move_pose_method == "try_linear_if_possible") {
    let try_linear_move_code = generateCode("move_linear_pose", [value_pose], true);
    let do_standard_move_code = generateCode("move_pose", [value_pose], true);
    var four_spaces = '    ';
    let command = ""

    // Create the try/except that tries the linear movement, catch the NiryoRosWrapper Exception, check if its message
    // contains the error message related to linear traj. impossible, and then tries the simple movement.
    command += '\n' + 'try:' + '\n';
    command += four_spaces + try_linear_move_code
    command += 'except NiryoRosWrapperException as e:' + '\n';
    command += four_spaces + "if 'cannot be reached with a linear trajectory' in str(e):" + '\n';
    command += four_spaces + four_spaces + do_standard_move_code
    return command

  }
}

Blockly.Python["niryo_one_saved_trajectory"] = function (block) {
  let saved_trajectory_name = block.getFieldValue('SAVED_TRAJECTORY_SELECTOR');
  code = '"' + saved_trajectory_name + '"'
  return [code, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_one_move_trajectory_from_trajectory'] = function (block) {
  let trajectory_name = Blockly.Python.valueToCode(block, 'TRAJECTORY', Blockly.Python.ORDER_MEMBER);
  return generateCode("execute_registered_trajectory", [trajectory_name], false);
}
//
Blockly.Python['niryo_one_move_trajectory'] = function (block) {
  // Get a string representing the list from the block 'list'
  let list_pose = Blockly.Python.valueToCode(block, 'LIST', Blockly.Python.ORDER_MEMBER);

  // Clean empty inputs
  list_pose = list_pose.split(', None').join('')
  list_pose = list_pose.split('None, ').join('')
  list_pose = list_pose.split('None').join('')

  // Get poses or joints element in the list, and create the list_type list
  let children_blocks = block.getChildren(true); // first get the 'create list with' block
  let sorted_children_element = children_blocks.sort((a, b) => (a.getRelativeToSurfaceXY().y > b.getRelativeToSurfaceXY().y ? 1 : -1)) // sort children list
  let list_element = sorted_children_element[0].getChildren(true); // input blocks of the list

  //sort the list of pose/joint according to their y coordinate, because children are not sorted correctly after one was moved
  // if we don't do that, the list_type is not in the right order and joints might be mistaken for poses --> IK issue
  let sorted_list_element = list_element.sort((a, b) => (a.getRelativeToSurfaceXY().y > b.getRelativeToSurfaceXY().y ? 1 : -1))

  let list_type = [];
  let list_non_pose_joint_elem = []; // gather blocks other than pose/joint

  sorted_list_element.forEach((elem, index) => {
    if (elem.type == "niryo_one_joints") {
      list_type.push("joint");
    }
    else if (elem.type == "niryo_one_pose" || elem.type == "niryo_one_saved_pose") {
      list_type.push("pose");
    }
    else {// the element is not a joint/pose
      list_non_pose_joint_elem.push(elem);
    }
  });

  // if at least one element of the list is not a joint/pose, prevent from running the program
  if (list_non_pose_joint_elem.length > 0) {
    return 'raise NiryoRosWrapperException("Warning: Move trajectory block only accepts a list of poses and joints") \n'
  } else {
    let dist_smoothing = Blockly.Python.valueToCode(block, 'DIST_SMOOTHING', Blockly.Python.ORDER_MEMBER);
    list_string_type_to_pass = JSON.stringify(list_type)
    return generateCode("execute_trajectory_from_poses_and_joints", [[list_pose], list_string_type_to_pass, dist_smoothing], false);
  }
}

Blockly.Python['niryo_one_pick_from_pose'] = function (block) {
  // Position object
  let value_pose = Blockly.Python.valueToCode(block, 'POSE', Blockly.Python.ORDER_MEMBER);

  return generateCode("pick_from_pose", [value_pose], true);
};

Blockly.Python['niryo_one_place_from_pose'] = function (block) {
  // Position object
  let value_pose = Blockly.Python.valueToCode(block, 'POSE', Blockly.Python.ORDER_MEMBER);

  return generateCode("place_from_pose", [value_pose], true);
}

Blockly.Python['niryo_one_shift_pose'] = function (block) {
  let dropdown_shift_pose_method = block.getFieldValue('SHIFT_POSE_METHOD_SELECT');

  let dropdown_shift_pose_axis = block.getFieldValue('SHIFT_POSE_AXIS');
  let number_shift_pose_value = Blockly.Python.valueToCode(block, 'SHIFT_POSE_VALUE');

  // convert deg to rad
  if ((block.data === 'deg') && (dropdown_shift_pose_axis == "ShiftPose.ROT_ROLL" || dropdown_shift_pose_axis == "ShiftPose.ROT_PITCH" || dropdown_shift_pose_axis == "ShiftPose.ROT_YAW")) {
    number_shift_pose_value = THREE.Math.degToRad(number_shift_pose_value.replace(/[\])}[{(]/g, '')).toFixed(3);
  }

  if (dropdown_shift_pose_method == "MoveCommandType.SHIFT_POSE") {
    return generateCode("shift_pose", [dropdown_shift_pose_axis, number_shift_pose_value]);
  } else if (dropdown_shift_pose_method == "MoveCommandType.SHIFT_LINEAR_POSE") {
    return generateCode("shift_linear_pose", [dropdown_shift_pose_axis, number_shift_pose_value]);
  } else if (dropdown_shift_pose_method == "try_linear_if_possible") {
    let try_linear_shift_code = generateCode("shift_linear_pose", [dropdown_shift_pose_axis, number_shift_pose_value]);
    let do_standard_shift_code = generateCode("shift_pose", [dropdown_shift_pose_axis, number_shift_pose_value]);
    var four_spaces = '    ';
    let command = ""

    // Create the try/except that tries the linear movement, catch the NiryoRosWrapper Exception, check if its message
    // contains the error message related to linear traj. impossible, and then tries the simple movement.
    command += '\n' + 'try:' + '\n';
    command += four_spaces + try_linear_shift_code
    command += 'except NiryoRosWrapperException as e:' + '\n';
    command += four_spaces + "if 'cannot be reached with a linear trajectory' in str(e):" + '\n';
    command += four_spaces + four_spaces + do_standard_shift_code
    return command
  }
  return generateCode("shift_pose", [dropdown_shift_pose_axis, number_shift_pose_value]);
};



// I/O

Blockly.Python['niryo_one_gpio_state'] = function (block) {
  let dropdown_gpio_state_select = block.getFieldValue('GPIO_STATE_SELECT');
  return [dropdown_gpio_state_select, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_one_gpio_select'] = function (block) {
  let dropdown_gpio_select = block.getFieldValue('GPIO_SELECT');
  return [dropdown_gpio_select, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_one_sw_select'] = function (block) {
  let dropdown_sw_select = block.getFieldValue('SW_SELECT');
  return [dropdown_sw_select, Blockly.Python.ORDER_COLLECTION];
};


Blockly.Python['niryo_one_set_pin_mode'] = function (block) {
  let value_pin = Blockly.Python.valueToCode(block, 'SET_PIN_MODE_PIN', Blockly.Python.ORDER_MEMBER);
  let dropdown_pin_mode_select = block.getFieldValue('PIN_MODE_SELECT');

  return generateCode("set_pin_mode", [value_pin, dropdown_pin_mode_select]);
};

Blockly.Python['niryo_one_digital_write'] = function (block) {
  let value_pin = Blockly.Python.valueToCode(block, 'DIGITAL_WRITE_PIN', Blockly.Python.ORDER_MEMBER);
  let dropdown_pin_write_select = block.getFieldValue('PIN_WRITE_SELECT');

  return generateCode("digital_write", [value_pin, dropdown_pin_write_select]);
};

Blockly.Python['niryo_one_digital_read'] = function (block) {
  let value_pin = Blockly.Python.valueToCode(block, 'DIGITAL_READ_PIN', Blockly.Python.ORDER_MEMBER);

  let code = generateCode("digital_read", [value_pin], false, '');
  return [code, Blockly.Python.ORDER_ATOMIC];

};


Blockly.Python['niryo_one_set_12v_switch'] = function (block) {
  let value_pin = Blockly.Python.valueToCode(block, 'SET_12V_SWITCH', Blockly.Python.ORDER_MEMBER);
  let dropdown_set_12v_switch_select = block.getFieldValue('SET_12V_SWITCH_SELECT');

  return generateCode("digital_write", [value_pin, dropdown_set_12v_switch_select]);
};

// I/O for Ned2
Blockly.Python['niryo_one_gpio_select_analogic'] = function (block) {
  let dropdown_gpio_select = block.getFieldValue('GPIO_SELECT');
  return [dropdown_gpio_select, Blockly.Python.ORDER_COLLECTION];
};


Blockly.Python['niryo_one_gpio_select_digital'] = function (block) {
  let dropdown_gpio_select = block.getFieldValue('GPIO_SELECT');
  return [dropdown_gpio_select, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python["niryo_one_get_analogic"] = function (block) {
  let aioId = "'" + block.getFieldValue('ANALOGIC_ID') + "'";
  let code = generateCode("analog_read", [aioId], false, '');
  return [code, Blockly.Python.ORDER_ATOMIC];

};

Blockly.Python["niryo_one_get_digital"] = function (block) {
  let dioId = "'" + block.getFieldValue('DIGITAL_ID') + "'";
  let code = generateCode("digital_read", [dioId], false, '');
  return [code, Blockly.Python.ORDER_ATOMIC];

};

Blockly.Python["niryo_one_set_analogic"] = function (block) {
  let value = block.getFieldValue('ANALOGIC_VALUE');
  let aioId = "'" + block.getFieldValue('ANALOGIC_ID') + "'";
  return generateCode("analog_write", [aioId, value]);
};

Blockly.Python["niryo_one_set_digital"] = function (block) {
  let value = block.getFieldValue('DIGITAL_VALUE');
  let dioId = "'" + block.getFieldValue('DIGITAL_ID') + "'";
  return generateCode("digital_write", [dioId, "PinState." + value]);
};

// Tool

Blockly.Python['niryo_one_update_tool'] = function (_block) {
  return generateCode("update_tool", []);
};

Blockly.Python['niryo_one_grasp_w_tool'] = function (_block) {

  return generateCode("grasp_with_tool", []);
};

Blockly.Python['niryo_one_release_w_tool'] = function (_block) {

  return generateCode("release_with_tool", []);
};

Blockly.Python['niryo_one_open_gripper'] = function (block) {
  let number_open_speed = block.getFieldValue('OPEN_SPEED');

  return generateCode("open_gripper", [number_open_speed]);
};

Blockly.Python['niryo_one_close_gripper'] = function (block) {
  let number_close_speed = block.getFieldValue('CLOSE_SPEED');

  return generateCode("close_gripper", [number_close_speed]);
};

Blockly.Python['niryo_ned2_close_gripper'] = function (block) {
  let torque_percentage = block.getFieldValue('CLOSE_TORQUE');
  let hold_torque_percentage = block.getFieldValue('CLOSE_HOLD_TORQUE');

  return generateCode("close_gripper", [500, torque_percentage, hold_torque_percentage]);
};

Blockly.Python['niryo_ned2_open_gripper'] = function (block) {
  let torque_percentage = block.getFieldValue('OPEN_TORQUE');
  let hold_torque_percentage = block.getFieldValue('OPEN_HOLD_TORQUE');

  return generateCode("open_gripper", [500, torque_percentage, hold_torque_percentage]);
};

Blockly.Python['niryo_one_pull_air_vacuum_pump'] = function (_block) {

  return generateCode("pull_air_vacuum_pump", []);
};

Blockly.Python['niryo_one_push_air_vacuum_pump'] = function (_block) {

  return generateCode("push_air_vacuum_pump", []);
};

Blockly.Python['niryo_one_setup_electromagnet'] = function (block) {
  let value_electromagnet_pin = Blockly.Python.valueToCode(block, 'SETUP_ELECTROMAGNET_PIN', Blockly.Python.ORDER_MEMBER);

  return generateCode("setup_electromagnet", [value_electromagnet_pin]);
};

Blockly.Python['niryo_one_activate_electromagnet'] = function (block) {
  let value_electromagnet_pin = Blockly.Python.valueToCode(block, 'ACTIVATE_ELECTROMAGNET_PIN', Blockly.Python.ORDER_MEMBER);

  return generateCode("activate_electromagnet", [value_electromagnet_pin]);
};

Blockly.Python['niryo_one_deactivate_electromagnet'] = function (block) {
  let value_electromagnet_pin = Blockly.Python.valueToCode(block, 'DEACTIVATE_ELECTROMAGNET_PIN', Blockly.Python.ORDER_MEMBER);

  return generateCode("deactivate_electromagnet", [value_electromagnet_pin]);
};

Blockly.Python['niryo_one_enable_tcp'] = function (block) {
  let dropdown_activate_tcp_value = block.getFieldValue('ENABLE_TCP_VALUE');
  return generateCode('enable_tcp', [dropdown_activate_tcp_value]);
};

Blockly.Python['niryo_one_set_tcp'] = function (block) {
  let value_set_tcp = Blockly.Python.valueToCode(block, 'SET_TCP_VALUE', Blockly.Python.ORDER_MEMBER);
  return generateCode('set_tcp', [value_set_tcp], true);
};

// Utility

Blockly.Python['niryo_one_sleep'] = function (block) {
  let value_sleep_time = Blockly.Python.valueToCode(block, 'SLEEP_TIME');

  return generateCode("wait", [value_sleep_time]);
};

Blockly.Python['niryo_one_comment'] = function (block) {
  let text_comment_text = block.getFieldValue('COMMENT_TEXT');

  return '# ' + text_comment_text + '\n';
};

Blockly.Python['niryo_one_break_point'] = function (_block) {
  return generateCode("break_point", []);
};

// Vision

Blockly.Python['niryo_one_vision_color'] = function (block) {
  let dropdown_color_select = block.getFieldValue('COLOR_SELECT');
  return [dropdown_color_select, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_one_vision_shape'] = function (block) {
  let dropdown_shape_select = block.getFieldValue('SHAPE_SELECT');
  return [dropdown_shape_select, Blockly.Python.ORDER_COLLECTION];

};

Blockly.Python['niryo_one_workspace'] = function (block) {
  let workspace = "'" + block.getFieldValue('WORKSPACE_SELECT') + "'";
  return [workspace, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_one_vision_pick'] = function (block) {
  // Color (int) value (see g_shape_values at top of this file)
  let value_color = Blockly.Python.valueToCode(block, 'COLOR_SWITCH', Blockly.Python.ORDER_MEMBER);

  // Shape (int) value (see g_shape_values at top of this file)
  let value_shape = Blockly.Python.valueToCode(block, 'SHAPE_SWITCH', Blockly.Python.ORDER_MEMBER);

  // Name of workspace
  let workspace_name = Blockly.Python.valueToCode(block, 'WORKSPACE', Blockly.Python.ORDER_MEMBER);

  // Height in Millimeter
  let height_offset = Blockly.Python.valueToCode(block, 'HEIGHT_OFFSET', Blockly.Python.ORDER_MEMBER);

  let code = generateCode("vision_pick", [workspace_name, height_offset + '/1000.0', value_shape, value_color], false, '[0]');
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['niryo_one_vision_pick_w_pose'] = function (block) {
  // Color (int) value (see g_shape_values at top of this file)
  let value_color = Blockly.Python.valueToCode(block, 'COLOR_SWITCH', Blockly.Python.ORDER_MEMBER);

  // Shape (int) value (see g_shape_values at top of this file)
  let value_shape = Blockly.Python.valueToCode(block, 'SHAPE_SWITCH', Blockly.Python.ORDER_MEMBER);

  // Observation Pose
  let value_pose = Blockly.Python.valueToCode(block, 'OBSERVATION_POSE', Blockly.Python.ORDER_MEMBER);

  // Name of workspace
  let workspace_name = Blockly.Python.valueToCode(block, 'WORKSPACE', Blockly.Python.ORDER_MEMBER);

  // Height in centimeter
  let height_offset = Blockly.Python.valueToCode(block, 'HEIGHT_OFFSET', Blockly.Python.ORDER_MEMBER);

  let code = generateCode("vision_pick_w_obs_pose",
    [workspace_name, height_offset + '/1000.0', value_shape, value_color, value_pose], false, '[0]');
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['niryo_one_vision_is_object_detected'] = function (block) {
  // Color (int) value (see g_shape_values at top of this file)
  let value_color = Blockly.Python.valueToCode(block, 'COLOR_SWITCH', Blockly.Python.ORDER_MEMBER);

  // Shape (int) value (see g_shape_values at top of this file)
  let value_shape = Blockly.Python.valueToCode(block, 'SHAPE_SWITCH', Blockly.Python.ORDER_MEMBER);

  // Name of workspace
  let workspace_name = Blockly.Python.valueToCode(block, 'WORKSPACE', Blockly.Python.ORDER_MEMBER);

  let code = generateCode("detect_object", [workspace_name, value_shape, value_color], false, '[0]');
  return [code, Blockly.Python.ORDER_ATOMIC];

}

// Dynamic frame
Blockly.Python['niryo_frame'] = function (block) {
  let frame = "'" + block.getFieldValue('FRAME_SELECT') + "'";
  return [frame, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['niryo_move_in_frame'] = function (block) {
  // Name of frame
  let frame_name = Blockly.Python.valueToCode(block, 'FRAME', Blockly.Python.ORDER_MEMBER);

  let value_pose = Blockly.Python.valueToCode(block, 'POSE', Blockly.Python.ORDER_MEMBER);

  let dropdown_move_pose_method = block.getFieldValue('MOVE_POSE_METHOD_SELECT');

  value_pose = value_pose.trim()
  value_pose = value_pose.slice(1, -1);
  values = value_pose.split(',');
  commands = "";
  for (let i = 0; i < values.length; i++) {
    commands += values[i] + ",";
  }
  commands += ' frame=' + frame_name;

  if (dropdown_move_pose_method == "MoveCommandType.POSE") {
    return generateCode("move_pose", [commands], false);
  }
  else if (dropdown_move_pose_method == "MoveCommandType.LINEAR_POSE") {
    return generateCode("move_linear_pose", [commands], false);
  }
  else if (dropdown_move_pose_method == "try_linear_if_possible") {
    let try_linear_move_code = generateCode("move_linear_pose", [commands], false);
    let do_standard_move_code = generateCode("move_pose", [commands], false);
    var four_spaces = '    ';
    let command = "\n"

    // Create the try/except that tries the linear movement, catch the NiryoRosWrapper Exception, check if its message
    // contains the error message related to linear traj. impossible, and then tries the simple movement.
    command += '\n' + 'try:' + '\n';
    command += four_spaces + try_linear_move_code
    command += 'except NiryoRosWrapperException as e:' + '\n';
    command += four_spaces + "if 'cannot be reached with a linear trajectory' in str(e):" + '\n';
    command += four_spaces + four_spaces + do_standard_move_code
    return command
  }
}

Blockly.Python['niryo_move_relative'] = function (block) {
  let value_x = Blockly.Python.valueToCode(block, 'x')
  let value_y = Blockly.Python.valueToCode(block, 'y')
  let value_z = Blockly.Python.valueToCode(block, 'z')
  let value_roll = Blockly.Python.valueToCode(block, 'roll').replace(/[\])}[{(]/g, '');
  let value_pitch = Blockly.Python.valueToCode(block, 'pitch').replace(/[\])}[{(]/g, '');
  let value_yaw = Blockly.Python.valueToCode(block, 'yaw').replace(/[\])}[{(]/g, '');

  // convert deg to rad
  if (block.data == 'deg') {
    value_roll = THREE.Math.degToRad(value_roll).toFixed(3);
    value_pitch = THREE.Math.degToRad(value_pitch).toFixed(3);
    value_yaw = THREE.Math.degToRad(value_yaw).toFixed(3);
  }

  let values = "[" + value_x + ", " + value_y + ", " + value_z + ", " + value_roll + ", " + value_pitch + ", " + value_yaw + "]";

  let dropdown_move_pose_method = block.getFieldValue('MOVE_POSE_METHOD_SELECT');

  if (dropdown_move_pose_method == "MoveCommandType.POSE") {
    return generateCode("move_relative", [values, "frame='world'"], false);
  }
  else if (dropdown_move_pose_method == "MoveCommandType.LINEAR_POSE") {
    return generateCode("move_linear_relative", [values, "frame='world'"], false);
  }
  else if (dropdown_move_pose_method == "try_linear_if_possible") {
    let try_linear_move_code = generateCode("move_linear_relative", [values, "frame='world'"], false);
    let do_standard_move_code = generateCode("move_relative", [values, "frame='world'"], false);
    var four_spaces = '    ';
    let command = ""

    // Create the try/except that tries the linear movement, catch the NiryoRosWrapper Exception, check if its message
    // contains the error message related to linear traj. impossible, and then tries the simple movement.
    command += '\n' + 'try:' + '\n';
    command += four_spaces + try_linear_move_code
    command += 'except NiryoRosWrapperException as e:' + '\n';
    command += four_spaces + "if 'cannot be reached with a linear trajectory' in str(e):" + '\n';
    command += four_spaces + four_spaces + do_standard_move_code
    return command
  }
}

Blockly.Python['niryo_block_frame'] = function (block) {
  let frame = Blockly.Python.valueToCode(block, 'FRAME', Blockly.Python.ORDER_MEMBER)

  // Get all statements
  var statements = Blockly.Python.statementToCode(block, 'STATEMENTS');
  var commandStatement = ""

  if (statements.length > 0) {
    commandStatement = statements.split('\n');
  }

  command = "\n";

  for (let i = 0; i < commandStatement.length; i++) {
    commandStatement[i] = commandStatement[i].slice(2)  //remove first 2 blank space
    // Replace frame in move command
    if ((commandStatement[i].includes("move_pose") || commandStatement[i].includes("move_linear_pose")) && !commandStatement[i].includes("frame=")) {
      commandStatement[i] = commandStatement[i].replace(")", (", frame=" + frame + ")"));
    }
    // Replace frame in relative command
    if (commandStatement[i].includes("move_relative") || commandStatement[i].includes("move_linear_relative")) {
      commandStatement[i] = commandStatement[i].replace("frame=world", "frame=" + frame.toString());
    }
    command += commandStatement[i] + "\n";
  }
  return command
};

// Conveyor

Blockly.Python['niryo_one_conveyor_models'] = function (block) {
  let conveyor_model_id = block.getFieldValue('CONVEYOR_SELECT');
  return [conveyor_model_id, Blockly.Python.ORDER_COLLECTION];
}

Blockly.Python['niryo_one_conveyor_use'] = function (_block) {
  return generateCode("set_conveyor", []);
}

Blockly.Python['niryo_one_conveyor_control'] = function (block) {
  let conveyor_id = Blockly.Python.valueToCode(block, 'CONVEYOR_SWITCH', Blockly.Python.ORDER_MEMBER);
  let speed_percent = Blockly.Python.valueToCode(block, 'SPEED_PERCENT', Blockly.Python.ORDER_MEMBER);
  let direction = block.getFieldValue('DIRECTION_SELECT');

  return generateCode("control_conveyor", [conveyor_id, 'True', speed_percent, direction]);
}

Blockly.Python['niryo_one_conveyor_stop'] = function (block) {
  let conveyor_id = Blockly.Python.valueToCode(block, 'CONVEYOR_SWITCH', Blockly.Python.ORDER_MEMBER);

  return generateCode("control_conveyor", [conveyor_id, 'False', 0, 1]);
}

// Ligth and Sound Category
Blockly.Python["sound_volume"] = function (block) {
  let volume = block.getFieldValue("VOLUME");
  return generateCode("sound.set_volume", [
    volume,
  ]);
};

Blockly.Python["play_sound"] = function (block) {
  return generateCode("sound.play", [
    "'" + block.getFieldValue('SOUND_SELECTOR') + "'",
    "wait_end=" + block.getFieldValue("BLOCKING_INPUT"),
  ]);
};

Blockly.Python["play_sound_from_to"] = function (block) {
  return generateCode("sound.play", [
    "'" + block.getFieldValue('SOUND_SELECTOR') + "'",
    "start_time_sec=" + block.getFieldValue("START_TIME"),
    "end_time_sec=" + block.getFieldValue("END_TIME"),
    "wait_end=" + block.getFieldValue("BLOCKING_INPUT"),
  ]);
};

Blockly.Python["stop_sound"] = function (block) {
  return generateCode("sound.stop", []);
};

Blockly.Python["led_ring_none"] = function (block) {
  return generateCode("led_ring.turn_off", []);
};

Blockly.Python['led_ring_color_block'] = function (block) {
  let colorRGBA = "[" + block.getFieldValue("RED") + "," + block.getFieldValue("GREEN") + "," + block.getFieldValue("BLUE") + ",0]";
  return [colorRGBA, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python['set_led_color'] = function (block) {
  let colorRGBA = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_MEMBER);
  let led_id = Blockly.Python.valueToCode(block, 'LED_ID', Blockly.Python.ORDER_MEMBER);
  return generateCode("led_ring.set_led_color", [led_id, colorRGBA]);
};

Blockly.Python["led_ring_solid"] = function (block) {
  Blockly.Python.valueToCode(block, 'SPEED_PERCENT', Blockly.Python.ORDER_MEMBER);
  let colorRGBA = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_MEMBER);
  return generateCode("led_ring.solid", [
    colorRGBA,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["led_ring_chase"] = function (block) {
  let period = block.getFieldValue("PERIOD");
  let iterations = block.getFieldValue("ITERATIONS");
  let colorRGBA = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_MEMBER);
  return generateCode("led_ring.chase", [
    colorRGBA,
    "period=" + period,
    "iterations=" + iterations,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["led_ring_flashing"] = function (block) {
  let period = block.getFieldValue("PERIOD");
  let iterations = block.getFieldValue("ITERATIONS");
  let colorRGBA = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_MEMBER);
  return generateCode("led_ring.flashing", [
    colorRGBA,
    "period=" + period,
    "iterations=" + iterations,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["led_ring_wipe"] = function (block) {
  let period = block.getFieldValue("PERIOD");
  let colorRGBA = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_MEMBER);
  return generateCode("led_ring.wipe", [
    colorRGBA,
    "period=" + period,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["led_ring_rainbow"] = function (block) {
  let period = block.getFieldValue("PERIOD");
  let iterations = block.getFieldValue("ITERATIONS");
  return generateCode("led_ring.rainbow", [
    "period=" + period,
    "iterations=" + iterations,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["led_ring_rainbow_cycle"] = function (block) {
  let period = block.getFieldValue("PERIOD");
  let iterations = block.getFieldValue("ITERATIONS");
  return generateCode("led_ring.rainbow_cycle", [
    "period=" + period,
    "iterations=" + iterations,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["led_ring_rainbow_chase"] = function (block) {
  let period = block.getFieldValue("PERIOD");
  let iterations = block.getFieldValue("ITERATIONS");
  return generateCode("led_ring.rainbow_chase", [
    "period=" + period,
    "iterations=" + iterations,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["led_ring_go_up"] = function (block) {
  let period = block.getFieldValue("PERIOD");
  let iterations = block.getFieldValue("ITERATIONS");
  let colorRGBA = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_MEMBER);
  return generateCode("led_ring.go_up", [
    colorRGBA,
    "period=" + period,
    "iterations=" + iterations,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["led_ring_go_down"] = function (block) {
  let period = block.getFieldValue("PERIOD");
  let iterations = block.getFieldValue("ITERATIONS");
  let colorRGBA = Blockly.Python.valueToCode(block, 'COLOR', Blockly.Python.ORDER_MEMBER);
  return generateCode("led_ring.go_up_down", [
    colorRGBA,
    "period=" + period,
    "iterations=" + iterations,
    "wait=" + block.getFieldValue("WAIT"),
  ]);
};

Blockly.Python["custom_button_state"] = function (block) {
  let dropdown_state_select = block.getFieldValue('CUSTOM_BUTTON_ACTION_SELECT');
  return [dropdown_state_select, Blockly.Python.ORDER_COLLECTION];
};

Blockly.Python["is_button_pressed"] = function (block) {
  let code = generateCode("custom_button.is_pressed", [], false, '');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["wait_for_button_action"] = function (block) {

  let action = Blockly.Python.valueToCode(block, 'BUTTON_ACTION_SWITCH', Blockly.Python.ORDER_MEMBER);
  let timeout = block.getFieldValue("TIMEOUT");

  return generateCode("custom_button.wait_for_action", [action, timeout]);
};

Blockly.Python["get_and_wait_for_button_action"] = function (block) {
  let timeout = block.getFieldValue("TIMEOUT");

  let code = generateCode("custom_button.wait_for_any_action", [timeout], false, '');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["button_press_duration"] = function (block) {
  let timeout = block.getFieldValue("TIMEOUT");

  let code = generateCode("custom_button.get_and_wait_press_duration", [timeout], false, '');
  return [code, Blockly.Python.ORDER_ATOMIC];
};