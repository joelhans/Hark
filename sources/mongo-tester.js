db.Users.remove({'username': 'test'});
db.Feeds.remove({'owner': 'test'});

var user = {
        "email" : "no-one@harkhq.com",
        "username" : "test",
        "password" : "$2a$10$QQ38LeTQHG1wYSmb6dc5R.tU8fxBMun0NQOHAG/oewfMXUIalIWvq",
        "salt" : "$2a$10$QQ38LeTQHG1wYSmb6dc5R.",
        "_id" : ObjectId("4fa3c91e687dd06b18000002")
	}

db.Users.save(user);