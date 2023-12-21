from pyniryo import *

# - Constants
workspace_name = "tic_tac_wspace"  # Robot's Workspace Name
robot_ip_address = "192.168.68.107"
robot = NiryoRobot(robot_ip_address)
# Calibrate robot if the robot needs calibration
robot.calibrate_auto()
# Updating tool
robot.update_tool()

robot.say('hello',0)

robot.close_connection()