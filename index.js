// Generated by CoffeeScript 1.10.0
var slice = [].slice;

module.exports = function(transitions) {
  var actions, f, from, i, j, len, len1, map, transition;
  map = {};
  actions = {};
  for (i = 0, len = transitions.length; i < len; i++) {
    transition = transitions[i];
    from = transition.from;
    if (!(transition.from instanceof Array)) {
      from = [from];
    }
    for (j = 0, len1 = from.length; j < len1; j++) {
      f = from[j];
      if (!map[f]) {
        map[f] = {};
      }
      if (map[f][transition.action] != null) {
        throw "Action " + transition.action + " already available from " + f;
      }
      actions[transition.action] = true;
      map[f][transition.action] = transition.to;
    }
  }
  return function(initialstate, callbacks) {
    var action, fn, k, len2, ref, result;
    if (map[initialstate] == null) {
      throw initialstate + " is not a valid state";
    }
    if (callbacks == null) {
      callbacks = {};
    }
    result = {
      state: initialstate,
      is: function(state) {
        return result.state === state;
      },
      can: function(action) {
        if (map[result.state] == null) {
          throw result.state + " is not a valid state";
        }
        return map[result.state][action] != null;
      },
      cannot: function(action) {
        return !result.can(action);
      },
      transitions: function() {
        if (map[result.state] == null) {
          throw result.state + " is not a valid state";
        }
        return map[result.state];
      },
      actions: function() {
        return Object.keys(result.transitions());
      }
    };
    ref = Object.keys(actions);
    fn = function(action) {
      return result[action] = function() {
        var args, to;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (map[result.state] == null) {
          throw result.state + " is not a valid state";
        }
        if (map[result.state][action] == null) {
          throw action + " is not available from " + result.state;
        }
        to = map[result.state][action];
        if (callbacks["exit" + result.state] != null) {
          callbacks["exit" + result.state].apply(callbacks, [action, result.state, to].concat(slice.call(args)));
        }
        if (callbacks["on" + action] != null) {
          callbacks["on" + action].apply(callbacks, [action, result.state, to].concat(slice.call(args)));
        }
        if (callbacks["enter" + to] != null) {
          callbacks["enter" + to].apply(callbacks, [action, result.state, to].concat(slice.call(args)));
        }
        return result.state = to;
      };
    };
    for (k = 0, len2 = ref.length; k < len2; k++) {
      action = ref[k];
      fn(action);
    }
    return result;
  };
};