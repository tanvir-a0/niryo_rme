import pickle

new = []

with open('traj_li.pkl', 'rb') as f:
    load_traj_li = pickle.load(f)


for i in load_traj_li:
    print(i)

    c = input('')

    if c == 'add':
        new.append(i)

print(new)