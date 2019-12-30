//var select = (function(){
//var x, i, j, selElmnt, a, b, c;
///* Look for any elements with the class "custom-select": */
//x = document.getElementsByClassName("custom-select");
//for (i = 0; i < x.length; i++) {
//  selElmnt = x[i].getElementsByTagName("select")[0];
//  /* For each element, create a new DIV that will act as the selected item: */
//  a = document.createElement("DIV");
//  a.setAttribute("class", "select-selected");
//  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
//  x[i].appendChild(a);
//  /* For each element, create a new DIV that will contain the option list: */
//  b = document.createElement("DIV");
//  b.setAttribute("class", "select-items select-hide");
//  for (j = 1; j < selElmnt.length; j++) {
//    /* For each option in the original select element,
//    create a new DIV that will act as an option item: */
//    c = document.createElement("DIV");
//    c.innerHTML = selElmnt.options[j].innerHTML;
//    c.addEventListener("click", function(e) {
//        /* When an item is clicked, update the original select box,
//        and the selected item: */
//        var y, i, k, s, h;
//        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
//        h = this.parentNode.previousSibling;
//        for (i = 0; i < s.length; i++) {
//          if (s.options[i].innerHTML == this.innerHTML) {
//            s.selectedIndex = i;
//            h.innerHTML = this.innerHTML;
//            y = this.parentNode.getElementsByClassName("same-as-selected");
//            for (k = 0; k < y.length; k++) {
//              y[k].removeAttribute("class");
//            }
//            this.setAttribute("class", "same-as-selected");
//            break;
//          }
//        }
//        h.click();
//    });
//    b.appendChild(c);
//  }
//  x[i].appendChild(b);
//  a.addEventListener("click", function(e) {
//    /* When the select box is clicked, close any other select boxes,
//    and open/close the current select box: */
//    e.stopPropagation();
//    closeAllSelect(this);
//    this.nextSibling.classList.toggle("select-hide");
//    this.classList.toggle("select-arrow-active");
//  });
//}
//
//function closeAllSelect(elmnt) {
//  /* A function that will close all select boxes in the document,
//  except the current select box: */
//  var x, y, i, arrNo = [];
//  x = document.getElementsByClassName("select-items");
//  y = document.getElementsByClassName("select-selected");
//  for (i = 0; i < y.length; i++) {
//    if (elmnt == y[i]) {
//      arrNo.push(i)
//    } else {
//      y[i].classList.remove("select-arrow-active");
//    }
//  }
//  for (i = 0; i < x.length; i++) {
//    if (arrNo.indexOf(i)) {
//      x[i].classList.add("select-hide");
//    }
//  }
//}
//
///* If the user clicks anywhere outside the select box,
//then close all select boxes: */
//document.addEventListener("click", closeAllSelect);
//})();


var app = (function(){
    var budgetController = (function(){

        var Expense = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }

        Expense.prototype.calcPerc = function(totalIncome){
            if (totalIncome > 0){
                this.percentage = Math.round((this.value/totalIncome)*100);
            } else {
                this.percentage = -1;
            }
        }
        
        Expense.prototype.getPerc = function(){
            return this.percentage;
        }
        
        var Income = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
        }

        var data = {
            allItems: {
                inc: [],
                exp: []
            },
            totals: {
                exp: 0,
                inc: 0
            },
            budget: 0,
            percentage: 0
        }

        var calculateTotals = function(type){
            var sum = 0;
            data.allItems[type].forEach(function(cur){
                sum += cur.value;
            })
            data.totals[type] = sum;
        }

        return {
            addItem: function(type, des, val){
                var newItem, ID;

                // create ID
                if (data.allItems[type].length){
                    ID = data.allItems[type][data.allItems[type].length -1].id +1;
                } else {
                    ID = 0;
                }

                // Create item
                if (type === 'inc') {
                    newItem = new Income(ID, des, val);
                } else if (type === 'exp') {
                    newItem = new Expense(ID, des, val)
                }

                // Push it back
                data.allItems[type].push(newItem);
                return newItem;
            },
            deleteItem: function(type, ID){

                var index, ids;

                ids = data.allItems[type].map(function(current){
                    return current.id;
                });

                index = ids.indexOf(ID);

                if (index !== -1){
                    data.allItems[type].splice(index, 1);
                }

            },
            calculateBudget: function(){

                // Calculate all totals incomes and expenses
                calculateTotals('inc');
                calculateTotals('exp');            

                // Calculate the budget
                data.budget = data.totals.inc - data.totals.exp;

                // Calculate the percentage
                if (data.totals.inc > 0){
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                } else {
                    data.percentage = -1;
                }
            },
            calculatePercentage: function(){
                data.allItems.exp.forEach(function(cur){
                    cur.calcPerc(data.totals.inc);
                })
            },
            getPercentage: function(){
                var allPerc = data.allItems.exp.map(function(cur){
                    return cur.getPerc();
                });
                return allPerc;
            },
            getBudget: function(){
                return {
                  budget: data.budget,
                  totalInc: data.totals.inc,
                  totalExp: data.totals.exp,
                  percentage: data.percentage
                }  
            },
            test: function(){
                var password = prompt('Password:')
                if (password == 'esc2004'){
                    console.log(data);
                } else {
                    console.log('Not available')
                }
            }
        }

    })();

    var UIController = (function(){

        var DOMstrings = {
            inputOne: '.add__type',
            inputTwo: '.add__description',
            inputThree: '.add__value',
            
            inputType: document.querySelector(this.inputOne),
            inputDescription: document.querySelector(this.inputTwo),
            inputValue: document.querySelector(this.inputThree),

            incomesContainer: document.querySelector('.incomes__list'),
            expensesContainer: document.querySelector('.expenses__list'),

            addBtnDOM: document.querySelector('.add__btn'),

            fields: document.querySelectorAll('.add__description, .add__value'),

            budgetLabel: document.querySelector('.budget__value'),

            incomesLabel: document.querySelector('.budget__incomes--value'),
            expensesLabel: document.querySelector('.budget__expenses--value'),

            percentageLabel: document.querySelector('.budget__expenses--percentage'),

            budgetListContainer: document.querySelector('.container'),
            
            expensesListPercentages: '.item__percentage',
            
            dateLabel: document.querySelector('.budget__title--month'),
        };
        
        var formatNumber = function(num, type){
                var int, backup;
                
                backup = num;
                num = Math.abs(num);
                num = num.toFixed(2);
                
                int = num.split('.')[0];
                if (int.length > 3){
                    int = int.substr(0, int.length-3) + ',' + int.substr(int.length - 3, int.length);
                }
                
                if (parseInt(backup) == 0){
                    return int + '.' + num.split('.')[1];
                } else {
                    return (type == 'exp' ? '-' : '+') + ' ' + int + '.' + num.split('.')[1];
                }
        };

        var nodeListForEach = function(list, callback){
            for (var i = 0; i < list.length; i++){
                callback(list[i], i);
            }
        };
        
        return {
            getInput: function(){
                return {
                    type: document.querySelector(DOMstrings.inputOne).value, // will be either inc or exp
                    description: document.querySelector(DOMstrings.inputTwo).value,
                    value: parseFloat(document.querySelector(DOMstrings.inputThree).value)
                };
            },
            addListItem: function(obj, type){
                var html, newHtml, element;
                if (type == 'inc'){
                    element = DOMstrings.incomesContainer;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type == 'exp') {
                    element = DOMstrings.expensesContainer;
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                // replace the placeholders
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

                // Inject it in the UI
                element.insertAdjacentHTML('beforeend', newHtml);
            },
            removeListItem: function(selectorID){
                var selectedID = document.getElementById(selectorID);
                selectedID.parentNode.removeChild(selectedID);
            },
            clearFields: function(){
                var fieldsArr = Array.prototype.slice.call(DOMstrings.fields);
                fieldsArr.forEach(function(current, index, array){
                    current.value = "";
                });
                fieldsArr[0].focus();
            },
            getDOMstrings: function(){
                return DOMstrings;
            },

            displayBudget: function(obj){
                
                DOMstrings.budgetLabel.textContent = formatNumber(obj.budget, (obj.budget > 0 ? 'inc' : 'exp'));
                DOMstrings.incomesLabel.textContent = formatNumber(obj.totalInc, 'inc');
                DOMstrings.expensesLabel.textContent = formatNumber(obj.totalExp, 'exp');

                if (obj.percentage > 0){
                    DOMstrings.percentageLabel.textContent = obj.percentage + '%';
                } else {
                    DOMstrings.percentageLabel.textContent = '---';
                }
            },
            
            displayPercentages: function(percs){
                
                var percsLabels = document.querySelectorAll(DOMstrings.expensesListPercentages);
                
                nodeListForEach(percsLabels, function(current, index){
                    if (percs[index] > 0){
                        current.textContent = percs[index] + '%';
                    } else {
                        current.textContent = '---';
                    }
                    
                });
            },
            displayMonth: function(){
                var now, year, month;
                now = new Date();
                
                year = now.getFullYear();
                month = now.getMonth();
                
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                
                DOMstrings.dateLabel.textContent = months[month] + ' ' + year;
            },
            changedType: function(){
                var fields = document.querySelectorAll(
                    DOMstrings.inputOne + ', ' +
                    DOMstrings.inputTwo + ', ' +
                    DOMstrings.inputThree
                );
                
                nodeListForEach(fields, function(cur){
                   cur.classList.toggle('red-focus'); 
                });
                
                DOMstrings.addBtnDOM.classList.toggle('red');
            }
        }

    })();

    var controller = (function(budgetCtrl, UICtrl){

        var setUpEventListeners = function(){

            var DOM = UICtrl.getDOMstrings()

            document.addEventListener('keypress',function(event){
                if (event.keyCode === 13 || event.which === 13){
                    addFunc();
                }
            });

            DOM.addBtnDOM.addEventListener('click', addFunc);

            DOM.budgetListContainer.addEventListener('click', deleteFunc);
            
            document.querySelector(DOM.inputOne).addEventListener('change', UICtrl.changedType);

        }

        var updateBudget = function(){

            // 1. Calculate the Budget
            budgetCtrl.calculateBudget();

            // 2. Return the budget
            var budget = budgetCtrl.getBudget();

            // 3. Display the budget on the UI
            UICtrl.displayBudget(budget);
        };
        
        var updatePercentages = function(){
            
            // 1. calculate the percentages  
            budgetCtrl.calculatePercentage();
            
            // 2. read the percentages from the budget controller 
            var percentages = budgetCtrl.getPercentage();            
            
            // 3. update the UI  
            UICtrl.displayPercentages(percentages);            
        };

        var addFunc = function(){

            var input, newItem;

            // 1. getting the info from the fields
            input = UICtrl.getInput();

            if (!(input.description == '') && !(isNaN(input.value)) && (input.value > 0)){

                // 2. Add it to the budget Controller
                newItem = budgetCtrl.addItem(input.type, input.description, input.value)

                // 3. Add item to the UI
                UICtrl.addListItem(newItem, input.type);

            }

            // 4. clear all fields
            UICtrl.clearFields();

            // 5. Calculate the budget
            updateBudget();
            
            // 6. Calculate the percentages
            updatePercentages();

        }

        var deleteFunc = function(event){
            var itemID, ID, type;

            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

            if (itemID) {
                type = itemID.split('-')[0];
                ID = parseInt(itemID.split('-')[1]);

                // 1. Delete the item from the data structure
                budgetCtrl.deleteItem(type, ID);

                // 2. Remove the item from the UI
                UICtrl.removeListItem(itemID);

                // 3. Recalculate and update the budget
                updateBudget();
                
            }
            
            // calculate the percentages
            updatePercentages();
        }

        return {
            init: function(){
                setUpEventListeners();
                UICtrl.displayMonth();
                UICtrl.displayBudget({
                  budget: 0,
                  totalInc: 0,
                  totalExp: 0,
                  percentage: 0
              });
            }
        }

    })(budgetController, UIController);

    controller.init();
    return {
        test: budgetController.test
    };
})();