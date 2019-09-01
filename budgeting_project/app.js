
var budgetController = (function() {
   
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome > 0){
            this.percentage = Math.floor((this.value/totalIncome)*100);
        } else {
            this.percentage = -1;
        }
        
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    

    
    
	return {

        
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1] //+1 .id
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },
        
        deleteItem: function(type, xyz){
            
            var ids, index;
            
            ids = data.allItems[type].map(function(current){
               return current.id;  //.id
            });
            
            index = ids.indexOf(xyz); //id
            
            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }
        },
        
        calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.floor((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }            
            
            // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        },
        

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals["inc"]);
            });
        },

        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
		
		testing: function(){
			console.log(data);
		}
		
	}
	        
        
    
        
})();








var uiController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputVal: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    }
    
    
    var formatNumber = function(num, type) {
        var ar, numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        ar = num.toFixed(2);

        numSplit = ar.split('.');
        
        

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;
        
        

    };
        
    var nodeListForEach = function(list, callback){
        for(var i = 0; i <list.length; i++){
            callback(list[i], i)
        }
    };

    
    return{
        getInput: function(){
            
            return{
                
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inputVal).value)
                
            }
                
        },
        
        
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
  
        clearInput: function(){
            var listFields, convertedToArray;
          
            listFields = document.querySelectorAll(DOMstrings.inputDesc + ", "+ DOMstrings.inputVal);
            //from list convert to real array
            convertedToArray = Array.prototype.slice.call(listFields);
            convertedToArray.forEach(function(current){
                
                current.value = ""; 
            });
            
            convertedToArray[0].focus();
            
        },
        
        
        displayPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            

            /*
            var nodeListForEach = function(list, callback){
                for(var i = 0; i <list.length; i++){
                    callback(list[i], i)
                }
            };
            
            */
            
            nodeListForEach(fields, function(current, index) {
               
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                    console.log(fields[1])
                } else {
                    current.textContent = 'n/a';
                }
                
            });
            

            
            
        },

              
        getDOMstrings: function(){
            return DOMstrings;
        },
    
        
        addListItem: function(obj, type){
            
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);        
        },
        
        deleteListItem: function(selectorID){
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        displayMonth: function(){
            var time, month, months, year;
            
            time = new Date();
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            month = time.getMonth();
            year = time.getFullYear();
            date = time.getDate()
            
            document.querySelector(DOMstrings.dateLabel).textContent =  date + ' ' + months[month] + ' ' + year;  
        },
        
        changedType: function(){
            
            var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDesc + ',' +
            DOMstrings.inputVal);
            
            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        }
        
        
    }; 
    
})();














var controller = (function(bdgtCtrl, uiCtrl){
    
    var setupEventListener = function(){
        
        var DOM = uiCtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(e){
           if(e.keyCode === 13){
               ctrlAddItem();
           } 
        });
        
        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType)
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        
        
    };
    
    var updateBudget = function(){
        
        bdgtCtrl.calculateBudget();
        var budget = bdgtCtrl.getBudget();
        
        //display the budget
        uiCtrl.displayBudget(budget);
    }
    
    var updatePercentages = function(){
        
        bdgtCtrl.calculatePercentages()
        
        var percent = bdgtCtrl.getPercentages()
        
                
        uiCtrl.displayPercentages(percent);
        
    }
    
    var ctrlAddItem = function (){
        
        var input, newItem
        
        // get the field input data (uiController)
        input = uiCtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        
            // add to data str (budgetController)
            newItem = bdgtCtrl.addItem(input.type, input.description, input.value);
            // take input to the UI
            uiCtrl.addListItem(newItem, input.type);
            // clear fields after input
            uiCtrl.clearInput();

            updateBudget();
            
            updatePercentages()
            
        }

    }
    
    var ctrlDeleteItem = function (event){
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        
        if(itemID){
            splitID = itemID.split('-')
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            
            //delete the item from data structure
             budgetController.deleteItem(type, ID);
            
            //delete the UI
            uiCtrl.deleteListItem(itemID)
            
            //re-calculate budget
            updateBudget();
        }
        

        
    }
    
    return {
        init: function(){
            setupEventListener();
            uiCtrl.displayMonth();
            uiCtrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1

                }
            
            );
        }
    }
    
    
})(budgetController, uiController);


controller.init();

