from flask import jsonify, request

from ships import game_map

def register_routes(app):
    @app.route('/game/', methods=['GET'])
    def get_map():
        return jsonify({ 'map': game_map })

    @app.route('/game/ships/', methods=['POST'])
    def sumbit_user_ships():
        body = request.get_json()
        print(body)

        return jsonify({ 'map': 'created' }), 201

# @app.route('/xl-spaceship/protocol/game/new', methods=['POST'])
# def create_game():
#     """
#     As a player, I want to receive a new simulation request for a simulation
#       with another player.
#
#     Set up a game with another player.
#
#     expect
#
#     {
#         user_id: 'xebialabs-1',
#         full_name: 'xebialabs opponent',
#         spaceship_protocol: {
#           hostname: '127.0.0.1',
#           port: 9001
#         }
#     }
#     """
#     response = {
#       'user_id': 'player',
#       'full_name': 'Assesment player',
#       'game_id': 'match-1',
#       'startting': 'xebialabs-1'
#     }
#     return jsonify(response)
#
# @app.route('/xl-spaceship/user/game/<game_id>')
# def game_status(game_id):
#     """
#     As a player I want to view the status of the game in progress
#
#     Grid symbols:
#       *: A quadrant taken by part of a ship.
#       -: A quadrant that contains a missed shot.
#       X: A quadrant taken by part of a ship which was hit by a shot.
#       .: An empty or unknown quadrant.
#     """
#     response = {
#         'self': {
#             'user_id': 'player-1',
#             'board': [
#                 '**.**.....',
#                 '..*.......',
#                 '**.**.....',
#                 '...', # Rest of the board
#             ]
#         },
#         'opponent': {
#             'user_id': 'xebialabs-1',
#             'board': [
#                 '..........',
#                 '..........',
#                 '..........',
#                 '...', # Rest of the board
#             ]
#         },
#         'game': {
#             'player_turn': 'player-1'
#         }
#     }
#     return jsonify(response)
#
# @app.route('xl-spaceship/protocol/game/<game_id>', methods=['PUT'])
# def game_fire(game_id):
#     """
#     As a player, I can be fired upon by my opponent
#
#     receives:
#     {
#       'salvo': ['0x0', '8x4','DxA', 'AxA','7xF']
#     }
#
#     Shot status:
#         hit: The shot was hit on a ship.
#         kill: The shot was the last hit on a ship, destroying it.
#         miss: the shot missed.
#
#     If game is over, returns 404 Not-found
#     """
#     response = {
#         'salvo': {
#             '0x0': 'hit',
#             '8x4': 'hit',
#             'DxA': 'kill',
#             'AxA': 'miss',
#             '7xF', 'miss'
#         },
#         'game': {
#             'player_turn': 'player-1'
#             # 'won': 'xebialabs-1' # If if was the last move on the game
#         }
#     }
