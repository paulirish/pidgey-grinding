if (false && 'serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js', { scope: '/' }).then((reg) => {
		if (reg.installing) {
			console.log('Service worker installing');
		} else if(reg.waiting) {
			console.log('Service worker installed');
		} else if(reg.active) {
			console.log('Service worker active');
		}
	}).catch((error) => {
		console.log('Registration failed with ' + error); // Registration failed
	});

  // Communicate with the service worker using MessageChannel API.
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        resolve(`Direct message from SW: ${event.data}`);
      };

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    });
  }
}


// bling.js
var $ = window.$ = document.querySelector.bind(document);
var $$ = window.$$ = document.querySelectorAll.bind(document);
Node.prototype.on = window.on = function(name, fn) {
  this.addEventListener(name, fn);
}
NodeList.prototype.__proto__ = Array.prototype;
NodeList.prototype.on = NodeList.prototype.addEventListener = (function(name, fn) {
  this.forEach(function(elem) {
    elem.on(name, fn);
  });
});


/**
 * Adapted from http://www.pidgeycalc.com/ by BaiChanKheo
 */

var TIME_TO_EVOLVE = 30;
var CANDIES_TO_EVOLVE = 12;
var POKEMON_NAME = "Pidgey";

// Listener for select changes
$("#pokemon").on("change", function(e) {
    var elem = e.currentTarget;
    POKEMON_NAME = elem.options[elem.selectedIndex].text; 
    CANDIES_TO_EVOLVE = elem.options[elem.selectedIndex].value;
    $("#selected-pokemon").html(POKEMON_NAME);
});

$$("input").forEach(function(e){
	e.on("input", calculate);
});
$("select").on("change", calculate);
$('button').on('click', calculate);
    
// Do this when submit is clicked
function calculate() {
    // Clear output
    $("#output").innerHTML = "";

    // Get input amounts
    var pidgeys = parseInt($("#pidgey-amount").value, 10) || 0;
    var candies = parseInt($("#candy-amount").value, 10) || 0;

    if (pidgeys > 99999 || candies > 99999) {
        $("#error").innerHTML = "Too many " + POKEMON_NAME + "s or Candies!";
    } else {
        $("#error").innerHTML = "";

        // Counters
        var evolveCount = 0;
        var transferCount = 0;

        // How many can be evolved without transfers
        var canStillEvolve = true;
        while (canStillEvolve) {
            // Not enough candies to evolve or no Pidgeys
            if (Math.floor(candies / CANDIES_TO_EVOLVE) === 0 || pidgeys === 0) {
                canStillEvolve = false;
            } else {
                pidgeys--; // Evolve a Pidgey
                candies -= CANDIES_TO_EVOLVE; // Remove the candy
                candies++; // Gain 1 candy per evolution
                evolveCount++;
                if (pidgeys === 0) {
                    break;
                }
            }
        }

        // Evolutions after transferring Pidgeys
        var shouldTransfer = true;
        while (shouldTransfer) {
            // Not enough to transfer and evolve or no Pidgeys left
            if ((candies + pidgeys) < (CANDIES_TO_EVOLVE + 1) || pidgeys === 0) {
                shouldTransfer = false;
                break;
            }

            // Keep transferring until enough candies
            while (candies < CANDIES_TO_EVOLVE) {
                transferCount++;
                pidgeys--;
                candies++;
            }

            // Evolve a Pidgey
            pidgeys--;
            candies -= CANDIES_TO_EVOLVE;
            candies++;
            evolveCount++;
        }

        var eggsToUse = Math.floor((evolveCount * TIME_TO_EVOLVE / 60) / 30);

        // Output
        var html = "";
        html += "<p>You should transfer <b>" + transferCount + "</b> " + POKEMON_NAME + "s before activating your Lucky Egg</p>";
        html += "<p>You will be able to evolve <b>" + evolveCount + "</b> " + POKEMON_NAME + "s, gaining <b>" + evolveCount * 1000 + "</b> XP</p>";
        html += "<p>On average, it will take about <b>" + (evolveCount * TIME_TO_EVOLVE / 60) + "</b> minutes to evolve your " + POKEMON_NAME + "s</p>";
        html += "<p>You will have <b>" + pidgeys + "</b> " + POKEMON_NAME + "s and <b>" + candies + "</b> Candies left over</p><br>";

        html += "<p><b>Recommendation: </b>";

        if (eggsToUse > 0) {
            html += "You should use <b>" + eggsToUse + "</b> Lucky Eggs</p>";
        } else {
            html += "Don't use any Lucky Eggs until you've found more " + POKEMON_NAME + "s!</p>";
        }

        $("#output").innerHTML = html;
    }
}
