var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');
var rp = require('request-promise');

var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;


var budgets = {
  1: {
    spent: 230,
    color: "008F8F",
    name: "#Financial Products",
    value: 230,
    startDate: "2016-12-01",
    id: 1
  },
  2: {
    spent: 970,
    color: "008F8F",
    name: "#salary",
    value: 30,
    startDate: "2016-12-01",
    id: 2
  },
  3: {
    spent: 40,
    color: "008F8F",
    name: "#income",
    value: 123,
    startDate: "2016-12-01",
    id: 3
  }
}

function getBudget(id) {

  //"http://fm-dev.spf.strands.com/api/budgetgoals/history/all.action"

  return budgets[id]
}

var budgetsType = new GraphQLObjectType({
  name: 'Budget',
  description: "Historical Budgets",
  fields: {
    spent: {
      type: GraphQLInt,
      description: "Spent Amount",
    },
    color: {
      type: GraphQLString,
      description: "Cat Color",
    },
    name: {
      type: GraphQLString,
      description: "Budget Category"
    },
    value: {
      type: GraphQLInt,
      description: "Budget Goal"
    },
    startDate: {
      type: GraphQLString,
      description: "Start Date",
    },
    id: {
      type: GraphQLInt,
      description: "ID of this Budget",
    }
  }
});

var queryType = new GraphQLObjectType({
  name: 'query',
  description: "Budget query",
  fields: {
    budget: {
      type: budgetsType,
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: function(_, args){
        return getBudget(args.id)
      }
    }
  }
});

var schema = new GraphQLSchema({
  query: queryType
});

var fetchDataFromAPI = function() {
  console.log("FETCH BUDGETS");
  var options = {
  uri: "http://fm-dev.spf.strands.com/api/budgetgoals/history/all.action",
  method: 'GET',
  json: true,
  headers: {
    "Content-type": "application/json;charset=utf-8",
    "HTTP_STRANDS_USER": "testUserBU1"
    }
  };

  rp(options).then(function(res) {
    console.log(res);
  })
}
var graphQLServer = express();
graphQLServer.use('/', (req, res, next) => {
  console.log("req", req);

  /*switch (req.body.entity) {
    case 'budgets':
      fetchBudgetsFromAPI();
      break;
    case 'transactions':
      fetchTransactionsFromAPI();
      break;
    default:
      next();
  }*/

  next();
});

graphQLServer.use(graphqlHTTP({ schema: schema, graphiql: true }));
graphQLServer.listen(8081);
console.log("The GraphQL Server is running.")

var compiler = webpack({
  entry: "./index.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
        publicPath: "/static/"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"
          }
        ]
    }
});

var app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${8081}`},
  publicPath: '/static/',
  stats: {colors: true}
});

// Serve static resources
app.use('/', express.static('static'));
app.listen(3000);
console.log("The App Server is running.")
