x = '*'
map_size = 16

winger = [
    [x, None, x],
    [x, None, x],
    [None, x, None],
    [x, None, x],
    [x, None, x],
]

angle = [
    [x, None, None],
    [x, None, None],
    [x, None, None],
    [x, x, x],
]

a_class = [
    [None, x, None],
    [x, None, x],
    [x, x, x],
    [x, None, x],
]

b_class = [
    [x, x, None],
    [x, None, x],
    [x, x, None],
    [x, None, x],
    [x, x, None],
]

s_class = [
    [None, x, x],
    [x, None, None],
    [None, x, x],
    [None, None, x],
    [x, x, None],
]

game_map = list(map(lambda x: ['*']*map_size, [1]*map_size))
