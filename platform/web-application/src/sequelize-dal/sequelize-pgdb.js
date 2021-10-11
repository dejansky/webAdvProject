'use strict';

let waitTimeMilliseconds = 1000
let connectionAuthenticated = false

const { Sequelize, DataTypes, UniqueConstraintError } = require('sequelize')
const sequelize = new Sequelize('mypgDB', 'root', 'password', {
  host: 'pgdb',
  dialect: 'postgres',
  database: 'mypgDB',
  omitNull: true
});

function awaitSync() {
  sequelize.authenticate()
    .then(() => {
      console.log("POSTGRESQL & SEQUELIZE IS ALIVE!")
      connectionAuthenticated = true

      sequelize.sync()
        .then(() => {
          sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS tsv tsvector`)
          console.log("SYNCED")
        })
        .catch(err => {
          console.error(`POSTGRESQL ERROR: ${err}`)
        })
    })
    .catch(err => {
      console.error(`POSTGRESQL ERROR: ${err}`)
      setTimeout(awaitSync, waitTimeMilliseconds)
    })
}

setTimeout(awaitSync, waitTimeMilliseconds)

const postgresDB = {}
postgresDB.sequelize = sequelize
postgresDB.Sequelize = Sequelize


//User
postgresDB.users = sequelize.define('users', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    notNull: false,
  },

  username: {
    type: DataTypes.STRING(255),
    unique: true,
  },

  first_name: {
    type: DataTypes.STRING(255),
  },

  last_name: {
    type: DataTypes.STRING(255),
  },

  phone_number: {
    type: DataTypes.STRING(255),
  },

  email_address: {
    type: DataTypes.STRING(255),
    unique: true,
  },

  password: {
    type: DataTypes.STRING(255),
  },

  admin_flag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  employee_flag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
})



//Reservations
postgresDB.reservation = sequelize.define('reservation', {
  reservation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  table_id: {
    type: DataTypes.INTEGER,
    unique: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  reservation_date: {
    type: DataTypes.STRING(255),
  }
  
  // reservation_time: {
  //   type: DataTypes.STRING(255) 
  // }
})




//Table
postgresDB.table = sequelize.define('table', {
  table_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  table_seats: {
    type: DataTypes.INTEGER
  }
})



//Recipe
postgresDB.recipe = sequelize.define('recipe', {
  recipe_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recipe_type: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
  ,createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
})



//Drink
postgresDB.drink = sequelize.define('drink', {
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipe_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  recipe_description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  recipe_price: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})



//Meal
postgresDB.meal = sequelize.define('meal', {
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipe_meal: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  recipe_description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  recipe_price: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})


//Feedback
postgresDB.feedback = sequelize.define('feedback', {
  feedback_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  full_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})



//Global Settings
postgresDB.global_Settings = sequelize.define('global_settings', {
  site_title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  site_subtitle: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  site_header: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  general_contact_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  general_contact_email: {
    type: DataTypes.TEXT,
  },
  opening_times: {
    type: DataTypes.TEXT,
  },
  general_contact_phone_nr: {
    type: DataTypes.TEXT
  },
  about_content: {
    type: DataTypes.TEXT
  },
  contacts_obj_array: {
    type: DataTypes.JSON
  },
  createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
})



//Associations 
postgresDB.users.hasMany(postgresDB.reservation, {
  foreignKey: 'reservation_id'
})

postgresDB.reservation.belongsTo(postgresDB.users, {
  foreignKey: 'user_id'
})

postgresDB.table.hasMany(postgresDB.reservation, {
  foreignKey: 'reservation_id'
})

postgresDB.reservation.belongsTo(postgresDB.table, {
  foreignKey: 'table_id'
})

postgresDB.drink.belongsTo(postgresDB.recipe, {
  foreignKey: 'recipe_id'
})

postgresDB.meal.belongsTo(postgresDB.recipe, {
  foreignKey: 'recipe_id'
})




module.exports = postgresDB
