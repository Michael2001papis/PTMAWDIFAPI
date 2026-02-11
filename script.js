/**
 * Task Manager - אפליקציית ניהול משימות
 * כולל יבוא נתונים מ-API
 */

// ========== הודעות ==========
var msgEl = null;
function showMessage(text) {
  var existing = document.getElementById('taskMessage');
  if (existing) existing.remove();
  msgEl = document.createElement('div');
  msgEl.id = 'taskMessage';
  msgEl.className = 'task-message';
  msgEl.textContent = text;
  msgEl.setAttribute('role', 'alert');
  var main = document.querySelector('main');
  if (main) {
    main.insertBefore(msgEl, main.firstChild);
    setTimeout(function () {
      if (msgEl && msgEl.parentNode) msgEl.remove();
    }, 3000);
  }
}

// ========== DOM Elements ==========
var taskInput = document.getElementById('taskInput');
var dueDateInput = document.getElementById('dueDateInput');
var addTaskBtn = document.getElementById('addTaskBtn');
var filterAllBtn = document.getElementById('filterAll');
var filterActiveBtn = document.getElementById('filterActive');
var filterCompletedBtn = document.getElementById('filterCompleted');
var filterFavoritesBtn = document.getElementById('filterFavorites');
var sortByDateBtn = document.getElementById('sortByDateBtn');
var taskList = document.getElementById('taskList');
var resetBtn = document.getElementById('resetBtn');
var settingsBtn = document.getElementById('settingsBtn');
var settingsPanel = document.getElementById('settingsPanel');
var settingsOverlay = document.getElementById('settingsOverlay');
var closeSettingsBtn = document.getElementById('closeSettingsBtn');
var searchInput = document.getElementById('searchInput');
var searchBtn = document.getElementById('searchBtn');
var searchHistoryEl = document.getElementById('searchHistory');
var infoBtn = document.getElementById('infoBtn');
var infoPanel = document.getElementById('infoPanel');
var infoOverlay = document.getElementById('infoOverlay');
var closeInfoBtn = document.getElementById('closeInfoBtn');
var showTutorialAgainBtn = document.getElementById('showTutorialAgainBtn');
var tutorialOverlay = document.getElementById('tutorialOverlay');
var startTutorialBtn = document.getElementById('startTutorialBtn');
var authBtn = document.getElementById('authBtn');
var logoutBtn = document.getElementById('logoutBtn');
var userGreeting = document.getElementById('userGreeting');
var userNameDisplay = document.getElementById('userNameDisplay');
var authOverlay = document.getElementById('authOverlay');
var authPanel = document.getElementById('authPanel');
var closeAuthBtn = document.getElementById('closeAuthBtn');
var authTabLogin = document.getElementById('authTabLogin');
var authTabRegister = document.getElementById('authTabRegister');
var authFormLogin = document.getElementById('authFormLogin');
var authFormRegister = document.getElementById('authFormRegister');
var loginPhone = document.getElementById('loginPhone');
var loginPassword = document.getElementById('loginPassword');
var loginSubmitBtn = document.getElementById('loginSubmitBtn');
var registerName = document.getElementById('registerName');
var registerPhone = document.getElementById('registerPhone');
var registerPassword = document.getElementById('registerPassword');
var registerSubmitBtn = document.getElementById('registerSubmitBtn');

// ========== State ==========
var tasks = [];
var currentFilter = 'all';
var searchQuery = '';
var SEARCH_HISTORY_KEY = 'taskManagerSearchHistory';
var SEARCH_HISTORY_MAX = 10;
var USERS_KEY = 'taskManagerUsers';
var CURRENT_USER_KEY = 'taskManagerCurrentUser';

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

// ========== משתמשים (localStorage) ==========
function getUsers() {
  var data = localStorage.getItem(USERS_KEY);
  if (data) {
    try {
      var parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveUsers(usersArray) {
  localStorage.setItem(USERS_KEY, JSON.stringify(usersArray));
}

function getCurrentUser() {
  var data = localStorage.getItem(CURRENT_USER_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function isLoggedIn() {
  return !!getCurrentUser();
}

function register(fullName, phone, password) {
  var name = (fullName || '').trim();
  var tel = (phone || '').trim().replace(/\s/g, '');
  var pwd = password || '';

  if (!name || !tel || !pwd) {
    showMessage('יש למלא שם מלא, טלפון וסיסמה');
    return false;
  }
  if (pwd.length < 4) {
    showMessage('הסיסמה חייבת להכיל לפחות 4 תווים');
    return false;
  }

  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].phone === tel) {
      showMessage('הטלפון כבר רשום. התחבר לחשבון הקיים.');
      return false;
    }
  }

  users.push({ fullName: name, phone: tel, password: pwd });
  saveUsers(users);
  setCurrentUser({ fullName: name, phone: tel });
  return true;
}

function login(phone, password) {
  var tel = (phone || '').trim().replace(/\s/g, '');
  var pwd = password || '';

  if (!tel || !pwd) {
    showMessage('יש להזין טלפון וסיסמה');
    return false;
  }

  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].phone === tel && users[i].password === pwd) {
      setCurrentUser({ fullName: users[i].fullName, phone: users[i].phone });
      return true;
    }
  }
  showMessage('טלפון או סיסמה שגויים');
  return false;
}

function logout() {
  clearCurrentUser();
  updateAuthUI();
  renderTasks();
}

function updateAuthUI() {
  var user = getCurrentUser();
  if (user) {
    if (authBtn) authBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (userGreeting) userGreeting.classList.remove('hidden');
    if (userNameDisplay) userNameDisplay.textContent = user.fullName || user.phone;
  } else {
    if (authBtn) authBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (userGreeting) userGreeting.classList.add('hidden');
  }
  if (filterFavoritesBtn) {
    filterFavoritesBtn.style.display = user ? '' : 'none';
  }
  if (currentFilter === 'favorites' && !user) {
    setFilter('all');
  }
}

// ========== Filter Function ==========

/**
 * מסנן משימות לפי סוג הפילטר
 * @param {Array} tasksArray - מערך המשימות
 * @param {string} filter - 'all' | 'active' | 'completed'
 * @returns {Array} מערך מסונן
 */
function filterTasks(tasksArray, filter) {
  var result;
  switch (filter) {
    case 'completed':
      result = tasksArray.filter(function (task) {
        return task.completed === true;
      });
      break;
    case 'active':
      result = tasksArray.filter(function (task) {
        return task.completed === false;
      });
      break;
    case 'favorites':
      result = tasksArray.filter(function (task) {
        return task.favorite === true;
      });
      break;
    case 'all':
    default:
      result = tasksArray.slice();
  }
  if (searchQuery && searchQuery.trim()) {
    var q = searchQuery.trim().toLowerCase();
    result = result.filter(function (task) {
      var textMatch = task.text && task.text.toLowerCase().indexOf(q) !== -1;
      var dateMatch = task.dueDate && task.dueDate.indexOf(q) !== -1;
      return textMatch || dateMatch;
    });
  }
  return result;
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

  if (filtered.length === 0) {
    var emptyMsg = document.createElement('li');
    emptyMsg.className = 'empty-state';
    var txt = 'אין משימות. הוסף משימה חדשה למעלה!';
    if (searchQuery && searchQuery.trim()) txt = 'לא נמצאו משימות התואמות את החיפוש.';
    else if (currentFilter === 'favorites') txt = 'אין משימות מועדפות. לחץ ⭐ ליד משימה כדי לשמור.';
    else if (currentFilter === 'completed') txt = 'אין משימות שהושלמו.';
    else if (currentFilter === 'active' && tasks.length > 0) txt = 'כל המשימות הושלמו!';
    emptyMsg.innerHTML = '<span class="empty-text">' + txt + '</span>';
    taskList.appendChild(emptyMsg);
    return;
  }

  filtered.forEach(function (task) {
    if (task.favorite === undefined) task.favorite = false;

    var li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
    if (task.favorite) li.classList.add('favorite');

    var textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    var dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';
    dateSpan.textContent = task.dueDate ? 'תאריך יעד: ' + task.dueDate : 'ללא תאריך';

    var actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    var loggedIn = isLoggedIn();

    var favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'btn-favorite' + (task.favorite ? ' active' : '');
    favoriteBtn.textContent = task.favorite ? '⭐' : '☆';
    favoriteBtn.setAttribute('data-id', String(task.id));
    favoriteBtn.setAttribute('aria-label', task.favorite ? 'הסר ממועדפים' : 'הוסף למועדפים');
    favoriteBtn.title = task.favorite ? 'הסר ממועדפים' : 'הוסף למועדפים';
    if (!loggedIn) favoriteBtn.style.display = 'none';

    var editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = '✎';
    editBtn.setAttribute('data-id', String(task.id));
    editBtn.setAttribute('aria-label', 'ערוך משימה');
    if (!loggedIn) editBtn.style.display = 'none';

    var completeBtn = document.createElement('button');
    completeBtn.className = 'btn-complete';
    completeBtn.textContent = task.completed ? 'בטל השלמה' : 'הושלם';
    completeBtn.setAttribute('data-id', String(task.id));
    completeBtn.setAttribute('aria-label', task.completed ? 'בטל השלמה' : 'סמן כהושלם');

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'מחק';
    deleteBtn.setAttribute('data-id', String(task.id));
    deleteBtn.setAttribute('aria-label', 'מחק משימה');

    actionsDiv.appendChild(favoriteBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(textSpan);
    li.appendChild(dateSpan);
    li.appendChild(actionsDiv);

    if (loggedIn) {
      favoriteBtn.addEventListener('click', function () {
        toggleFavorite(task.id);
      });
      editBtn.addEventListener('click', function () {
        enterEditMode(li, task);
      });
    }

    completeBtn.addEventListener('click', function () {
      toggleComplete(task.id);
    });

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
    showMessage('יש להזין תיאור למשימה');
    if (taskInput) taskInput.focus();
    return;
  }

  var newTask = {
    id: Date.now(),
    text: text.substring(0, 500),
    dueDate: dueDate || null,
    completed: false,
    favorite: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();

  taskInput.value = '';
  if (dueDateInput) dueDateInput.value = '';
  taskInput.focus();
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

// ========== מועדפים ==========
function toggleFavorite(id) {
  var task = null;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      task = tasks[i];
      break;
    }
  }
  if (task) {
    task.favorite = !task.favorite;
    saveTasks(tasks);
    renderTasks();
  }
}

// ========== עריכת משימה ==========
function enterEditMode(li, task) {
  if (li.classList.contains('editing')) return;
  li.classList.add('editing');
  var oldText = task.text;
  var oldDate = task.dueDate || '';

  var editHtml = '<div class="edit-mode">';
  editHtml += '<input type="text" class="edit-text" value="' + escapeHtml(oldText) + '" maxlength="500" />';
  editHtml += '<input type="date" class="edit-date" value="' + escapeHtml(oldDate) + '" />';
  editHtml += '<button type="button" class="btn-save-edit">שמור</button>';
  editHtml += '<button type="button" class="btn-cancel-edit">ביטול</button>';
  editHtml += '</div>';

  var content = li.querySelector('.task-text');
  var dateSpan = li.querySelector('.task-date');
  var actions = li.querySelector('.task-actions');
  content.style.display = 'none';
  dateSpan.style.display = 'none';
  actions.style.display = 'none';

  var editWrap = document.createElement('div');
  editWrap.className = 'edit-wrap';
  editWrap.innerHTML = editHtml;
  li.insertBefore(editWrap, li.firstChild);

  var editText = editWrap.querySelector('.edit-text');
  var editDate = editWrap.querySelector('.edit-date');
  var saveBtn = editWrap.querySelector('.btn-save-edit');
  var cancelBtn = editWrap.querySelector('.btn-cancel-edit');

  editText.focus();

  function exitEdit() {
    document.removeEventListener('keydown', onEsc);
    li.classList.remove('editing');
    editWrap.remove();
    content.style.display = '';
    dateSpan.style.display = '';
    actions.style.display = '';
  }

  function onEsc(e) {
    var key = e.key || e.keyCode;
    if (key === 'Escape' || key === 27) {
      cancelBtn.click();
    }
  }

  saveBtn.addEventListener('click', function () {
    var newText = editText.value.trim();
    if (newText) {
      task.text = newText.substring(0, 500);
      task.dueDate = editDate.value || null;
      saveTasks(tasks);
    }
    exitEdit();
    renderTasks();
  });

  cancelBtn.addEventListener('click', exitEdit);

  editText.addEventListener('keypress', function (e) {
    var key = e.key || e.keyCode;
    if (key === 'Enter' || key === 13) saveBtn.click();
  });

  document.addEventListener('keydown', onEsc);
}

function escapeHtml(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ========== Update Filter ==========

/**
 * מעדכן את פילטר התצוגה ומרענן
 * @param {string} filter - 'all' | 'active' | 'completed' | 'favorites'
 */
function setFilter(filter) {
  currentFilter = filter;
  if (filterAllBtn) {
    filterAllBtn.classList[filter === 'all' ? 'add' : 'remove']('active');
    filterAllBtn.setAttribute('aria-pressed', filter === 'all' ? 'true' : 'false');
  }
  if (filterActiveBtn) {
    filterActiveBtn.classList[filter === 'active' ? 'add' : 'remove']('active');
    filterActiveBtn.setAttribute('aria-pressed', filter === 'active' ? 'true' : 'false');
  }
  if (filterCompletedBtn) {
    filterCompletedBtn.classList[filter === 'completed' ? 'add' : 'remove']('active');
    filterCompletedBtn.setAttribute('aria-pressed', filter === 'completed' ? 'true' : 'false');
  }
  if (filterFavoritesBtn) {
    filterFavoritesBtn.classList[filter === 'favorites' ? 'add' : 'remove']('active');
    filterFavoritesBtn.setAttribute('aria-pressed', filter === 'favorites' ? 'true' : 'false');
  }
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
        favorite: false,
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
      showMessage('לא ניתן לטעון משימות מהשרת. נסה שוב מאוחר יותר.');
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
  if (filterFavoritesBtn) filterFavoritesBtn.addEventListener('click', function () {
    setFilter('favorites');
  });

  if (sortByDateBtn) sortByDateBtn.addEventListener('click', function () {
    tasks = sortTasks(tasks);
    saveTasks(tasks);
    renderTasks();
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = searchInput.value;
      renderTasks();
    });
    searchInput.addEventListener('focus', showSearchHistory);
    searchInput.addEventListener('keypress', function (e) {
      var key = e.key || e.keyCode;
      if (key === 'Enter' || key === 13) performSearch();
    });
  }
  if (searchBtn) searchBtn.addEventListener('click', performSearch);
  document.addEventListener('click', function (e) {
    if (searchHistoryEl && !searchHistoryEl.contains(e.target) && searchInput && !searchInput.contains(e.target) && searchBtn && !searchBtn.contains(e.target)) {
      searchHistoryEl.hidden = true;
    }
  });

  if (infoBtn) infoBtn.addEventListener('click', openInfo);
  if (closeInfoBtn) closeInfoBtn.addEventListener('click', closeInfo);
  if (infoOverlay) infoOverlay.addEventListener('click', closeInfo);
  if (showTutorialAgainBtn) showTutorialAgainBtn.addEventListener('click', function () {
    closeInfo();
    localStorage.removeItem('taskManagerTutorialSeen');
    if (tutorialOverlay) tutorialOverlay.classList.remove('hidden');
  });
  if (startTutorialBtn) startTutorialBtn.addEventListener('click', finishTutorial);

  if (resetBtn) resetBtn.addEventListener('click', resetAllTasks);
  if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
  if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
  if (settingsOverlay) settingsOverlay.addEventListener('click', closeSettings);

  if (authBtn) authBtn.addEventListener('click', openAuth);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuth);
  if (authOverlay) authOverlay.addEventListener('click', closeAuth);
  if (authTabLogin) authTabLogin.addEventListener('click', function () {
    authTabLogin.classList.add('active');
    if (authTabRegister) authTabRegister.classList.remove('active');
    if (authFormLogin) authFormLogin.classList.remove('hidden');
    if (authFormRegister) authFormRegister.classList.add('hidden');
  });
  if (authTabRegister) authTabRegister.addEventListener('click', function () {
    authTabRegister.classList.add('active');
    if (authTabLogin) authTabLogin.classList.remove('active');
    if (authFormRegister) authFormRegister.classList.remove('hidden');
    if (authFormLogin) authFormLogin.classList.add('hidden');
  });
  if (loginSubmitBtn) loginSubmitBtn.addEventListener('click', function () {
    if (login(loginPhone ? loginPhone.value : '', loginPassword ? loginPassword.value : '')) {
      closeAuth();
      updateAuthUI();
      renderTasks();
      showMessage('התחברת בהצלחה');
    }
  });
  if (registerSubmitBtn) registerSubmitBtn.addEventListener('click', function () {
    if (register(
      registerName ? registerName.value : '',
      registerPhone ? registerPhone.value : '',
      registerPassword ? registerPassword.value : ''
    )) {
      closeAuth();
      updateAuthUI();
      renderTasks();
      showMessage('נרשמת בהצלחה');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      if (tutorialOverlay && !tutorialOverlay.classList.contains('hidden')) finishTutorial();
      else if (authPanel && !authPanel.hidden) closeAuth();
      else if (settingsPanel && !settingsPanel.hidden) closeSettings();
      else if (infoPanel && !infoPanel.hidden) closeInfo();
    }
  });
}

function openAuth() {
  if (authPanel) {
    authPanel.hidden = false;
    authPanel.setAttribute('aria-hidden', 'false');
    authTabLogin.classList.add('active');
    if (authTabRegister) authTabRegister.classList.remove('active');
    if (authFormLogin) authFormLogin.classList.remove('hidden');
    if (authFormRegister) authFormRegister.classList.add('hidden');
    if (loginPhone) loginPhone.focus();
  }
  if (authOverlay) {
    authOverlay.hidden = false;
    authOverlay.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
}

function closeAuth() {
  if (authPanel) {
    authPanel.hidden = true;
    authPanel.setAttribute('aria-hidden', 'true');
  }
  if (authOverlay) {
    authOverlay.hidden = true;
    authOverlay.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  if (authBtn) authBtn.focus();
}

// ========== חיפוש והיסטוריה ==========
function getSearchHistory() {
  try {
    var d = localStorage.getItem(SEARCH_HISTORY_KEY);
    return d ? JSON.parse(d) : [];
  } catch (e) {
    return [];
  }
}

function saveSearchToHistory(term) {
  if (!term || !term.trim()) return;
  var h = getSearchHistory();
  var t = term.trim();
  var idx = h.indexOf(t);
  if (idx !== -1) h.splice(idx, 1);
  h.unshift(t);
  if (h.length > SEARCH_HISTORY_MAX) h.pop();
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(h));
}

function showSearchHistory() {
  var h = getSearchHistory();
  if (!searchHistoryEl) return;
  if (h.length === 0) {
    searchHistoryEl.hidden = true;
    return;
  }
  searchHistoryEl.innerHTML = '';
  for (var i = 0; i < h.length; i++) {
    (function (term) {
      var item = document.createElement('div');
      item.className = 'search-history-item';
      item.textContent = term;
      item.addEventListener('click', function () {
        searchQuery = term;
        if (searchInput) searchInput.value = term;
        searchHistoryEl.hidden = true;
        renderTasks();
      });
      searchHistoryEl.appendChild(item);
    })(h[i]);
  }
  searchHistoryEl.hidden = false;
}

function performSearch() {
  if (searchInput) {
    searchQuery = searchInput.value;
    if (searchQuery.trim()) saveSearchToHistory(searchQuery);
  }
  renderTasks();
}

// ========== חלון מידע ==========
function openInfo() {
  if (infoPanel) {
    infoPanel.hidden = false;
    infoPanel.setAttribute('aria-hidden', 'false');
  }
  if (infoOverlay) {
    infoOverlay.hidden = false;
    infoOverlay.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
}

function closeInfo() {
  if (infoPanel) {
    infoPanel.hidden = true;
    infoPanel.setAttribute('aria-hidden', 'true');
  }
  if (infoOverlay) {
    infoOverlay.hidden = true;
    infoOverlay.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  if (infoBtn) infoBtn.focus();
}

// ========== הדרכה ==========
function finishTutorial() {
  localStorage.setItem('taskManagerTutorialSeen', '1');
  if (tutorialOverlay) tutorialOverlay.classList.add('hidden');
}

function showTutorialIfNeeded() {
  if (localStorage.getItem('taskManagerTutorialSeen')) return;
  if (tutorialOverlay) tutorialOverlay.classList.remove('hidden');
}

// ========== איפוס ==========
function resetAllTasks() {
  if (!confirm('למחוק את כל המשימות? לא ניתן לבטל.')) return;
  tasks = [];
  saveTasks(tasks);
  currentFilter = 'all';
  if (filterAllBtn) setFilter('all');
  renderTasks();
  showMessage('כל המשימות אופסו');
}

// ========== הגדרות (צבע וגודל) ==========
function getSettings() {
  try {
    var s = localStorage.getItem('taskManagerSettings');
    return s ? JSON.parse(s) : { theme: 'dark', size: 'medium' };
  } catch (e) {
    return { theme: 'dark', size: 'medium' };
  }
}

function saveSettings(settings) {
  localStorage.setItem('taskManagerSettings', JSON.stringify(settings));
}

function applySettings(settings) {
  var body = document.body;
  body.classList.remove('theme-dark', 'theme-light', 'theme-coral', 'theme-blue');
  body.classList.remove('size-small', 'size-medium', 'size-large');
  body.classList.add('theme-' + (settings.theme || 'dark'));
  body.classList.add('size-' + (settings.size || 'medium'));
}

function openSettings() {
  if (settingsPanel) {
    settingsPanel.hidden = false;
    settingsPanel.setAttribute('aria-hidden', 'false');
    var firstBtn = settingsPanel.querySelector('.theme-btn');
    if (firstBtn) firstBtn.focus();
  }
  if (settingsOverlay) {
    settingsOverlay.hidden = false;
    settingsOverlay.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
  var s = getSettings();
  var themeBtns = document.querySelectorAll('.theme-btn');
  for (var i = 0; i < themeBtns.length; i++) {
    themeBtns[i].classList.toggle('active', themeBtns[i].getAttribute('data-theme') === s.theme);
  }
  var sizeBtns = document.querySelectorAll('.size-btn');
  for (var j = 0; j < sizeBtns.length; j++) {
    sizeBtns[j].classList.toggle('active', sizeBtns[j].getAttribute('data-size') === s.size);
  }
}

function closeSettings() {
  if (settingsPanel) {
    settingsPanel.hidden = true;
    settingsPanel.setAttribute('aria-hidden', 'true');
  }
  if (settingsOverlay) {
    settingsOverlay.hidden = true;
    settingsOverlay.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  if (settingsBtn) settingsBtn.focus();
}

function initSettings() {
  var s = getSettings();
  applySettings(s);

  var themeBtns = document.querySelectorAll('.theme-btn');
  for (var i = 0; i < themeBtns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        s.theme = btn.getAttribute('data-theme');
        saveSettings(s);
        applySettings(s);
        for (var k = 0; k < themeBtns.length; k++) {
          themeBtns[k].classList.toggle('active', themeBtns[k] === btn);
        }
      });
    })(themeBtns[i]);
  }

  var sizeBtns = document.querySelectorAll('.size-btn');
  for (var j = 0; j < sizeBtns.length; j++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        s.size = btn.getAttribute('data-size');
        saveSettings(s);
        applySettings(s);
        for (var k = 0; k < sizeBtns.length; k++) {
          sizeBtns[k].classList.toggle('active', sizeBtns[k] === btn);
        }
      });
    })(sizeBtns[j]);
  }
}

// ========== Initialize ==========

function init() {
  initSettings();
  updateAuthUI();
  tasks = getTasks();
  initEventListeners();
  renderTasks(); // הצגה מיידית מהמטמון
  showTutorialIfNeeded();
  // דחיית טעינת API ל-tick נפרד - מפחית "Long task" ומשפר ביצועים
  setTimeout(function () {
    fetchInitialTasks();
  }, 0);
}

// הפעלה כשהדף נטען - דחייה ל-tick הבא כדי לא לחסום את הציור הראשוני
function runInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 0);
    });
  } else {
    setTimeout(init, 0);
  }
}
runInit();
