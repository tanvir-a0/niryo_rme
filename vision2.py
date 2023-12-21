from pyniryo import *


robot_ip_address = "192.168.68.107"

# The pose from where the image processing happens
observation_pose = [0.001, -0.214, 0.343, 0.094, 1.465, -1.478]
# Place pose
place_pose = PoseObject(
    x=0.16, y=0.0, z=0.1,
    roll=0.0, pitch=1.57, yaw=0.0,
)

# - Initialization
count = 3
# Connect to robot
robot = NiryoRobot(robot_ip_address)
# Calibrate robot if the robot needs calibration
robot.calibrate_auto()
# Updating tool
robot.update_tool()


robot.close_connection()