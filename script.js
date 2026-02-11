/**
 * Task Manager - אפליקציית ניהול משימות
 * כולל יבוא נתונים מ-API
 */

// ========== DOM Elements ==========
var taskInput = document.getElementById('taskInput');
var dueDateInput = document.getElementById('dueDateInput');
var addTaskBtn = document.getElementById('addTaskBtn');
var filterAllBtn = document.getElementById('filterAll');
var filterActiveBtn = document.getElementById('filterActive');
var filterCompletedBtn = document.getElementById('filterCompleted');
var sortByDateBtn = document.getElementById('sortByDateBtn');
var taskList = document.getElementById('taskList');

// ========== State ==========
var tasks = [];
var currentFilter = 'all';

// ========== localStorage Functions ==========

/**
 * מחזיר את רשימת המשימות מ-localStorage
 * @returns {Array} מערך משימות
 */
function getTasks() {
  var data = localStorage.getItem('tasks');
  if (data) {
    try {
      var parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('שגיאה בפענוח נתונים:', e);
      return [];
    }
  }
  return [];
}

/**
 * שומר את רשימת המשימות ל-localStorage
 * @param {Array} tasksArray - מערך המשימות לשמירה
 */
function saveTasks(tasksArray) {
  var jsonString = JSON.stringify(tasksArray);
  localStorage.setItem('tasks', jsonString);
}

// ========== Filter Function ==========

/**
 * מסנן משימות לפי סוג הפילטר
 * @param {Array} tasksArray - מערך המשימות
 * @param {string} filter - 'all' | 'active' | 'completed'
 * @returns {Array} מערך מסונן
 */
function filterTasks(tasksArray, filter) {
  switch (filter) {
    case 'completed':
      return tasksArray.filter(function (task) {
        return task.completed === true;
      });
    case 'active':
      return tasksArray.filter(function (task) {
        return task.completed === false;
      });
    case 'all':
    default:
      return tasksArray.slice();
  }
}

// ========== Sort Function ==========

/**
 * ממיין משימות לפי תאריך יעד
 * @param {Array} tasksArray - מערך המשימות
 * @returns {Array} מערך ממוין
 */
function sortTasks(tasksArray) {
  return tasksArray.slice().sort(function (a, b) {
    var dateA = new Date(a.dueDate || 0).getTime();
    var dateB = new Date(b.dueDate || 0).getTime();
    if (isNaN(dateA)) dateA = 0;
    if (isNaN(dateB)) dateB = 0;
    return dateA - dateB;
  });
}

// ========== Render Function ==========

/**
 * מעדכן את תצוגת רשימת המשימות
 */
function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = '';
  var filtered = filterTasks(tasks, currentFilter);

  filtered.forEach(function (task) {
    var li = document.createElement('li');
    if (task.completed) {
      li.classList.add('completed');
    }

    var textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    var dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';
    dateSpan.textContent = task.dueDate ? 'תאריך יעד: ' + task.dueDate : 'ללא תאריך';

    var actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    var completeBtn = document.createElement('button');
    completeBtn.className = 'btn-complete';
    completeBtn.textContent = task.completed ? 'בטל השלמה' : 'הושלם';
    completeBtn.setAttribute('data-id', String(task.id));

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'מחק';
    deleteBtn.setAttribute('data-id', String(task.id));

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(textSpan);
    li.appendChild(dateSpan);
    li.appendChild(actionsDiv);

    // מאזין להשלמה
    completeBtn.addEventListener('click', function () {
      toggleComplete(task.id);
    });

    // מאזין למחיקה
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });
}

// ========== Add Task ==========

/**
 * מוסיף משימה חדשה
 */
function addTask() {
  if (!taskInput) return;
  var text = taskInput.value.trim();
  var dueDate = dueDateInput ? dueDateInput.value : '';

  if (!text) {
    alert('יש להזין תיאור למשימה');
    return;
  }

  var newTask = {
    id: Date.now(),
    text: text,
    dueDate: dueDate || null,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();

  taskInput.value = '';
  if (dueDateInput) dueDateInput.value = '';
}

// ========== Toggle Complete ==========

/**
 * מחליף סטטוס השלמה של משימה
 * @param {number} id - מזהה המשימה
 */
function toggleComplete(id) {
  var task = null;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      task = tasks[i];
      break;
    }
  }
  if (task) {
    task.completed = !task.completed;
    saveTasks(tasks);
    renderTasks();
  }
}

// ========== Delete Task ==========

/**
 * מוחק משימה
 * @param {number} id - מזהה המשימה
 */
function deleteTask(id) {
  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });
  saveTasks(tasks);
  renderTasks();
}

// ========== Update Filter ==========

/**
 * מעדכן את פילטר התצוגה ומרענן
 * @param {string} filter - 'all' | 'active' | 'completed'
 */
function setFilter(filter) {
  currentFilter = filter;
  // תאימות: classList.toggle עם פרמטר שני לא נתמך בדפדפנים ישנים
  if (filterAllBtn) filterAllBtn.classList[filter === 'all' ? 'add' : 'remove']('active');
  if (filterActiveBtn) filterActiveBtn.classList[filter === 'active' ? 'add' : 'remove']('active');
  if (filterCompletedBtn) filterCompletedBtn.classList[filter === 'completed' ? 'add' : 'remove']('active');
  renderTasks();
}

// ========== Fetch Initial Tasks from API ==========

var API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';

/**
 * טוען נתונים מ-API - תומך ב-fetch וב-XMLHttpRequest (לדפדפנים ישנים)
 */
function fetchFromAPI(url) {
  return new Promise(function (resolve, reject) {
    if (typeof fetch !== 'undefined') {
      fetch(url)
        .then(function (response) {
          if (response.status !== 200) {
            reject(new Error('שגיאת API: ' + response.status));
            return;
          }
          return response.json();
        })
        .then(resolve)
        .catch(reject);
    } else if (typeof XMLHttpRequest !== 'undefined') {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error('שגיאת API: ' + xhr.status));
        }
      };
      xhr.onerror = function () {
        reject(new Error('שגיאת רשת'));
      };
      xhr.send();
    } else {
      reject(new Error('הדפדפן לא תומך בבקשות HTTP'));
    }
  });
}

/**
 * טוען משימות התחלתיות מ-API
 */
function fetchInitialTasks() {
  fetchFromAPI(API_URL)
    .then(function (data) {
      var mappedTasks = (Array.isArray(data) ? data : []).map(function (item) {
        return {
          id: (item && item.id ? item.id : 0) + 100000,
          text: (item && item.title) ? item.title : 'משימה',
          dueDate: null,
          completed: !!(item && item.completed),
        };
      });

      if (tasks.length === 0) {
        tasks = mappedTasks;
        saveTasks(tasks);
      }
      renderTasks();
    })
    .catch(function (error) {
      console.error('שגיאה בטעינת משימות מ-API:', error);
      alert('לא ניתן לטעון משימות מהשרת. נסה שוב מאוחר יותר.');
    });
}

// ========== Event Listeners ==========

function initEventListeners() {
  if (!addTaskBtn || !taskInput || !taskList) {
    console.error('Task Manager: לא נמצאו אלמנטים נדרשים ב-DOM');
    return;
  }

  addTaskBtn.addEventListener('click', function () {
    addTask();
  });

  // הוספת משימה בלחיצת Enter (תאימות: keyCode לדפדפנים ישנים)
  taskInput.addEventListener('keypress', function (e) {
    var key = e.key || e.keyCode;
    if (key === 'Enter' || key === 13) addTask();
  });

  if (filterAllBtn) filterAllBtn.addEventListener('click', function () {
    setFilter('all');
  });
  if (filterActiveBtn) filterActiveBtn.addEventListener('click', function () {
    setFilter('active');
  });
  if (filterCompletedBtn) filterCompletedBtn.addEventListener('click', function () {
    setFilter('completed');
  });

  if (sortByDateBtn) sortByDateBtn.addEventListener('click', function () {
    tasks = sortTasks(tasks);
    saveTasks(tasks);
    renderTasks();
  });
}

// ========== Initialize ==========

function init() {
  tasks = getTasks();
  initEventListeners();
  fetchInitialTasks();
}

// הפעלה כשהדף נטען (תאימות לדפדפנים שונים)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
