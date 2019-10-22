from http import HTTPStatus
import random
import string


from flask import jsonify, request

from ships import game_map, ships_configurations, generate_empty_map, map_size

PLAYER_ONE = 'player1'
PLAYER_TWO = 'player2'

def randomString(stringLength=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))


def getUserHeaders(req):
    *token, player_id, game_code = req.headers.get('Authorization').split('_')
    if not game_code or game_code not in created_games:
        raise Exception({ 'message': 'Room not found'})

    return player_id, game_code


def process_ships(y):
    return '*' if y == 's' else y


def process_map_rows(x):
    return list(map(process_ships, x))


def get_opponent_map(opponent_map):
    return list(map(process_map_rows, opponent_map))


def getOpponentData(player_id, game_data):
    oponent_id = PLAYER_TWO if player_id == PLAYER_ONE else PLAYER_ONE
    return oponent_id, game_data.get(oponent_id, {})

"""
Created games ideal structure
{
  game_code: {
    'player1': {
        'name': player_1_name,
        'ships': { ...player_1_ships_coordinates_place },  // Helps rebuild the map.
        'current_map': [ ...[], ...[], ...[player_1_map_status] ],
        'attacks': [...player_1_rounds_of attacks.] // Helps rebuild the map.
    },
    'player2': {
        'name': player_2_name,
        'ships': { ...player_2_ships_coordinates_place },  // Helps rebuild the map.
        'current_map': [ ...[], ...[], ...[player_2_map_status] ],
        'attacks': [...player_2_rounds_of attacks.] // Helps rebuild the map.
    },
    'code': game_code,
    'game_round':
    'current_turn':
    ''
  }
}
"""
created_games = {}


def register_routes(app):
    @app.route('/game/', methods=['GET'])
    def get_map():
        try:
            player_id, game_code = getUserHeaders(request)
        except:
            ## Currently it's the non-modified client
            return jsonify({ 'map': game_map }), 500

        try:
            game_data = created_games[game_code]
        except:
            return jsonify({ 'message': 'Room not found'}), 404

        # Game turn validation
        # Are this for attack?
        # if game_data['current_turn'] != player_id:
        #     return jsonify({ 'message': 'Not your turn' }),  400

        ## Return game general status
        if game_code is not None and game_code not in created_games:
            return jsonify({ 'message': 'Game does not exists' })

        request_player = game_data[player_id]
        oponent_id = PLAYER_TWO if player_id == PLAYER_ONE else PLAYER_ONE
        request_oponent = game_data.get(oponent_id, {})
        if 'current_map' not in request_oponent:
            return jsonify({ 'map': request_player['current_map'], 'oponent': { 'message': 'waiting for submission' } })

        opponent_map = get_opponent_map(request_oponent['current_map'])
        response = {
            'map': request_player['current_map'],
            'turn': game_data['current_turn'],
            'oponent': { 'map': opponent_map }
        }
        if 'game_round' in game_data and game_data['game_round'] == 'finished':
            response.update({ 'message': 'game has ended', 'winner': game_data['winner']})

        return jsonify(response)


    @app.route('/game/new/', methods=['POST'])
    def create_new_game():
        """

        Expected Body:
        { player_name: string }
        """
        body = request.get_json()
        player_name = body['playerName'] # ['player_name']  ## Missing marshmallow

        game_code = randomString(6)

        game_info = { PLAYER_ONE: { 'name': player_name }, 'code': game_code }
        created_games[game_code] = game_info

        return {
            'code': game_code,
            'token': f'generate_jwt_{PLAYER_ONE}_{game_code}',
            'role': PLAYER_ONE,
            'map': generate_empty_map()
        }

    @app.route('/game/new/join/', methods=['POST'])
    def join_new_game():
        """

        Expected Body:
        { player_name: string, code: string_game_code }
        """
        body = request.get_json()
        player_name = body['playerName']
        game_code = body['gameCode']
        game_info = created_games[game_code]

        if PLAYER_TWO in game_info:
            return jsonify({ 'message': 'Room full'}), 423  # status: Locked

        game_info[PLAYER_TWO] =  { 'name': player_name }

        return jsonify({
            'code': game_code,
            'token': f'generate_jwt_{PLAYER_TWO}_{game_code}',
            'role': PLAYER_TWO,
            'map': generate_empty_map()
        })


    @app.route('/game/new/ships/', methods=['POST'])
    def sumbit_player_ships():
        """
        Expected ships object:
            {
            	"ships": {
            		"0": {"x": 11, "y": 3, "orientation": "vertical"},
            		"1": {"x": 11, "y": 5, "orientation": "vertical"},
            		"2": {"x": 11, "y": 4, "orientation": "vertical"},
            		"3": {"x": 11, "y": 6, "orientation": "vertical"},
            		"4": {"x": 11, "y": 7, "orientation": "vertical"}
            	}
            }
        """
        *token, player_id, game_code = request.headers.get('Authorization').split('_')
        if not game_code or game_code not in created_games:
            return jsonify({ 'message': 'Room not found'}), 404

        body = request.get_json()

        game_data = created_games[game_code]
        player_data = game_data[player_id]
        if 'ships' in player_data:
            return jsonify({ 'message': 'Ships already placed' })

        ## Get ships coordinates
        ships = body['ships']
        orientation_list = lambda orientation: [1, 0] if orientation == 'vertical' else [0, 1]
        def get_ship_map_cells(ship_id):
            ship = ships[ship_id]
            x_0 = ship['x']
            y_0 = ship['y']
            config = ships_configurations[ship_id]
            res = []
            for ship_cell in range(config['size']):
                orien = orientation_list(ship['orientation'])
                x = x_0 + (ship_cell * orien[0])
                y = y_0 + (ship_cell * orien[1])
                res.append((x, y))
            return res

        ships_placing = map(get_ship_map_cells, ships)

        # Create user game map and populate the ships.
        build_player_map_with_ships = generate_empty_map()
        for ship in ships_placing:
            for x, y in ship:
                if not build_player_map_with_ships[x][y] == '*':
                    raise Exception('wrong ship placement')
                if 0 > x >= map_size or 0 > y >= map_size:
                    raise Exception('wrong ship placement')
                build_player_map_with_ships[x][y] = 's'

        # Update created_games with player initial status
        player_data.update({
            'ships': ships,
            'current_map': build_player_map_with_ships,
            'attacks': []
        })

        # If both players have created the map, the game status changes to start the game
        if 'ships' in game_data[PLAYER_ONE] and 'ships' in game_data.get(PLAYER_TWO, {}):
            game_data.update({
                'game_round': 1, # Games start from round 1
                'current_turn': PLAYER_ONE
            })

        return jsonify({ 'message': 'map created', 'map': build_player_map_with_ships }), 201

    @app.route('/game/turn/', methods=['POST'])
    def sumbit_player_turn_move():
        """
        Expected Request Body:
        {
          move: [x: int, y: int]
        }
        """
        try:
            player_id, game_code = getUserHeaders(request)
        except:
            ## Currently it's the non-modified client
            return jsonify({ 'map': game_map }), 500

        body = request.get_json()
        move = body['move']

        game_data = created_games[game_code]
        # Update opponent map with the attack
        opponent_id, opponent_data = getOpponentData(player_id, game_data)
        opponent_map = opponent_data['current_map']
        map_cell = opponent_map[move[0]][move[1]]
        if map_cell in ['h', 'm']:
            return jsonify({ 'message': 'invalid move' }), 400
        # Did the attack hit or missed
        opponent_map[move[0]][move[1]] = 'h' if map_cell == 's' else 'm'

        # Update player attacks list
        player_map = game_data[player_id]['attacks']
        player_map.append(move)

        # Verify if the game has finished, any ships left
        ships_left = list(filter(lambda cell: 's' in cell, opponent_map))
        if not ships_left:
            game_data['game_round'] = 'finished'
            game_data['current_turn'] = 'finished'
            game_data['winner'] = player_id
            # The game has finished, return the response to winner
            return jsonify({
                'turn': game_data['current_turn'],
                'oponent': { 'map': cleaned_opponent_map },
                'winner': game_data['winner']
            })

        # Update the Game status
        game_data['current_turn'] = opponent_id
        if opponent_id == PLAYER_ONE:
            game_next_round = game_data['game_round'] + 1
            game_data['game_round'] = game_next_round

        cleaned_opponent_map = get_opponent_map(opponent_map)
        return jsonify({
            'turn': game_data['current_turn'],
            'oponent': { 'map': cleaned_opponent_map }
        })

    # @app.route('/game/ships/', methods=['POST'])
    # def sumbit_user_ships():
    #     """ UNCOMMENT TO TEST INITIAL LOGIC"""
    #     body = request.get_json()
    #     print('body')
    #     print(body)
    #
    #     ships = body['ships']
    #     orientation_list = lambda orientation: [1, 0] if orientation == 'vertical' else [0, 1]
    #     def get_ship_map_cells(ship_id):
    #         ship = ships[ship_id]
    #         x_0 = ship['x']
    #         y_0 = ship['y']
    #         config = ships_configurations[ship_id]
    #         res = []
    #         for ship_cell in range(config['size']):
    #             orien = orientation_list(ship['orientation'])
    #             x = x_0 + (ship_cell * orien[0])
    #             y = y_0 + (ship_cell * orien[1])
    #             res.append((x, y))
    #         return res
    #
    #     ships_placing = map(get_ship_map_cells, ships)
    #     print(list(ships_placing))
    #
    #     return jsonify({ 'map': 'created' }), 201
