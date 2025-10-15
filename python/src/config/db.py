from pymongo import MongoClient
import certifi


# old local db url
# dbClient = MongoClient('mongodb+srv://infayou:rahul1234@cluster0.zbf0n.mongodb.net/infa?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true')
dbClient = MongoClient('mongodb://admin:Bxpro123@168.231.116.239:27017/infa?retryWrites=true&authSource=admin&replicaSet=rs0')


print(dbClient)
db = dbClient.get_database()
print(db)
Balances = db['balances']  # collection object
Market = db['markets']
Bet = db['bets']
Match = db['matches']
User = db['users']
BetLock = db['betlocks']
CasinoMatch = db['casinomatches']
Lenah = db['lenahs']
Denah = db['denahs']

#data = CasinoMatch.find_one({"match_id":12})
#print(data)
