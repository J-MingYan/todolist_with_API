//頁面
let A = document.querySelector('#A');
let B = document.querySelector('#B');
let C = document.getElementById('C');


// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
    
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault()
            if (!form.checkValidity()) {
                //event.preventDefault()
                event.stopPropagation()
            }
            
            form.classList.add('was-validated')
        }, false)
    })
})()

//金鑰
let token ='';

//---------------------

//介接 login 登入 API
const loginEmail = document.querySelector('#Email');
const loginPassword = document.querySelector("#pwd");
const loginBtn = document.querySelector("#login_btn");
const singupAccount = document.querySelector("#singup_account");

//註冊頁連結 click事件
singupAccount.addEventListener('click', (e) => {
    e.preventDefault();
    //console.log(123);
    A.classList.add('d-none');
    C.classList.remove('d-none'); 
});

loginBtn.addEventListener('click',function(e){
    login();
});
function login(){
    if(loginEmail.value.trim() === '' || loginPassword.value.trim() === ''){
        Swal.fire({
            title: "如需註冊請點選帳號註冊?",
            text: "或重試帳號密碼!",
            icon: "question"
          });
        return ;
    }

    axios.post(`https://todoo.5xcamp.us/users/sign_in`,{
        "user": {
            "email": loginEmail.value.trim(),
            "password": loginPassword.value.trim()
        }
    })
    .then((res) => {
        console.log(res.data.message);
        //console.log(res.headers.authorization)
        //金鑰
        //console.log(res,'看看');
        token = res.headers.authorization;

        //金鑰 方式二  優化 axios headers 設計
        //axios.defaults.headers.common['Authorization'] =res.headers.authorization

        if(res.data.message ==='登入成功'){
            Swal.fire({
                title: res.data.message,
                text: "歡迎回來",
                icon: "success"
            });
            //直接賦予使用者名稱
            let textName = document.querySelector('#textName');
            textName.textContent = res.data.nickname;

            A.classList.add('d-none');
            B.classList.remove('d-none');
            loginEmail.value = '';
            loginPassword.value = '';
            // setTimeout(() =>{
            //     window.location.replace('index_7.html');
            // },2000)
            getTodo();
        }
    })
    .catch((error) => {
        console.log(error.response);
        Swal.fire({
            title: error.response.data.message,
            text: "帳號或密碼不符",
            icon: "error",
        }); 
    })
}


//透過 axios 夾帶 token 觸發 get todo api
// 顯示待辦API
let todoData =[];
function getTodo(){
    axios.get(`https://todoo.5xcamp.us/todos`,{
        headers:{
            'Authorization':token
        }        
    })
    .then((res) =>{
        console.log(res,'查看查看');
        //console.log(res.data.todos,'正確唷');
        todoData = res.data.todos;
        render(todoData);//渲染render
        count(todoData);//渲染count // 計算待辦數量
        updateData();
    })
    .catch((error) => {
        console.log(error.response)
    })
}
//渲染的函式
//透過 querySelector 選取要放入資料的 ul
const list = document.querySelector('#list');
//console.log(list,'查看ＵＬ');

function render(todoData){
    //console.log(todoData,'看渲染的函式todoData');
    let str = [];

    todoData.forEach((itme) =>{
        //打勾切換狀態
        if(itme.completed_at === null){
            str+=
            `
                <li class="list-group-item fs-5 d-flex justify-content-between p-0">
                    <div data-id="${itme.id}" class="w-100 p-3">
                        <label class="checkbox" for="${itme.id}">
                            <input type="checkbox" ${itme.completed_at}>
                            <span>${itme.content}</span>
                        </label>
                    </div>
                    <button type="button" class="btn btn-dark me-1" id="delete" data-id="${itme.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button type="button" class="btn btn-primary" id="book" data-id="${itme.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                </li>
            `;
            list.innerHTML = str;
        }else{
            str+=
            `
                <li class="list-group-item fs-5 d-flex justify-content-between p-0">
                    <div data-id="${itme.id}" class="w-100 p-3">
                        <label class="checkbox" for="${itme.id}">
                            <input type="checkbox" ${itme.completed_at} checked>
                            <span>${itme.content}</span>
                        </label>
                    </div>
                    <button type="button" class="btn btn-dark me-1" id="delete" data-id="${itme.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button type="button" class="btn btn-primary" id="book" data-id="${itme.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                </li>
            `;
            list.innerHTML = str;
        }
    });
}

// 新增待辦API
const addtodoBtn = document.querySelector('#addtodoBtn');
const inputVal = document.querySelector('#inputVal');

//點擊 Enter 也可以新增資料
//註冊監聽 inputVal 的鍵盤 "keyup" 事件
inputVal.addEventListener("keyup", function (e) {
    //如果點擊到 "Enter"
    if (e.key === 'Enter') {
        if(inputVal.value.trim() ==''){
            Swal.fire({
                title: '請輸入待辦內容',
                text: "格式錯誤",
                icon: "error",
                showConfirmButton: false,
                timer: 2000
            }); 
        }else{
            //執行新增該筆資料
            addTodo();
            inputVal.value = '';
        }
    }
  });
addtodoBtn.addEventListener('click',function(e){
    console.log(e.target);

    if(inputVal.value.trim() ==''){
        Swal.fire({
            title: '請輸入待辦內容',
            text: "格式錯誤",
            icon: "error",
            showConfirmButton: false,
            timer: 2500
        }); 
    }else if(inputVal.value.trim() !==''){
        //console.log(inputVal.value,'看看inputVal.value');
        addTodo();
        inputVal.value = '';
    }
})
function addTodo(){
    axios.post(`https://todoo.5xcamp.us/todos`,{
        "todo": {
          "content": inputVal.value.trim(),
        },
    },{
        headers:{
            'Authorization':token
        } 
    })
    .then((res) => {
        console.log(res,'新增成功');
        getTodo();
    })
    .catch((error) => {
        console.log(error.response);
    })
}


//調整待辦狀態API //刪除&編輯&打勾---父層綁監聽抓子層---
list.addEventListener('click',(e) =>{
    //console.log(e.target.closest("li").dataset.id);
    //console.log(e.target.nodeName === 'INPUT');
    //console.log(e.target.closest("button").id =='delete');
    //console.log(e.target.closest("div").dataset.id);
    //console.log(itme.id===e.target.closest("li").dataset.id);
    //透過 closest 的方式能找出點擊到的 li 標籤
    //透過 dataset.id 取出埋在該 li 內的 id
    let id = e.target.closest("div").dataset.id;
    if(e.target.closest("div").dataset.id){            
        toggleApi(id);
        //console.log(id);
    }else if(e.target.closest("button").id =='delete'){
        //console.log('????');
        Swal.fire({
            title: "是否刪除?",
            text: "確定不在努力看看!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "確定!",
            cancelButtonText: "取消!",
        })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                title: "刪除成功!",
                text: "已從資料庫清楚",
                icon: "success"
                });
                id = e.target.closest("button").dataset.id;
                deleteTodo(id);
            }else{
                Swal.fire({
                    title: "取消成功!",
                    text: "繼續努力",
                    icon: "success"
                });
            }
        });
    }else if(e.target.closest("button").id =='book'){
        Swal.fire({
            title: "編輯待辦",
            text: "待辦事項修改!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "確定!",
            cancelButtonColor: "#d33",
            cancelButtonText: "取消!",

            input: 'text',
            inputAttributes: {
              autocapitalize: 'off',
            },
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
                const data = {
                    todo: {
                        content: login.trim(),
                    },
                };
                //console.log(data);
                return todoText = data.todo.content;
            },
        })
        .then((result) => {
            console.log(result);
            if(result.value === ''){
                Swal.fire("請正確輸入!");
            }else{
                if(result.isConfirmed){
                    Swal.fire({
                    title: "編輯成功!",
                    text: "已從資料庫更新",
                    icon: "success",
                    })
                    id = e.target.closest("button").dataset.id;
                    //console.log(id,todoText);
                    editTodo(id,todoText);
                }else if(result.dismiss){
                    Swal.fire({
                        title: "取消編輯!",
                        text: "繼續努力",
                        icon: "success"
                    });
                }
            }
        })
    }
})
// TODO 完成／未完成切換(html)
function toggleApi(id) {
    axios.patch(`https://todoo.5xcamp.us/todos/${id}/toggle`,{},{
        headers:{
            'Authorization':token
        } 
    })
      .then((res) => {
        //console.log(res,321);
        //console.log(res.data.completed_at !== null);
        getTodo();
      })
      .catch((error) => {
        console.log(error.response);
      });
}
// 計算待辦數量
const workNum = document.getElementById("workNum");
function count(todoData){
    //console.log(todoData);
    let todoCount = todoData.filter((item) => item.completed_at === null);
    workNum.textContent = todoCount.length;
};
//註冊監聽是否點擊到 tab
const TAB = document.getElementById("TAB");
let tabStatus = 'all';//預設顯示狀態為全部

TAB.addEventListener('click',function(e){
    e.preventDefault();
    //console.log(e.target.nodeName);
    if(e.target.nodeName !== 'A'){
        return ;
    }else if(e.target.nodeName === 'A'){
        //改變分頁狀態
        tabStatus = e.target.dataset.ttaab;   
        //console.log(tabStatus);
        //改變(被點擊)分頁樣式 CSS
        const navA = document.querySelectorAll('.nav a')//類陣列
        navA.forEach((itme)=>{
            itme.classList.remove('tab');
        });
        //有被點擊到的才加 class 樣式
        e.target.classList.add('tab');
        updateData();
    }
});
//修改完成狀態
function updateData(){
    let newData = [];
    if(tabStatus === 'all'){
        newData = todoData;
    }else if(tabStatus === 'work'){
        newData = todoData.filter((itme) => itme.completed_at === null);
    }else if(tabStatus === 'done'){
        newData = todoData.filter((itme) => itme.completed_at !== null);
    }
    render(newData);//渲染render(todoData)
};
//刪除API deleteTodo()----------
function deleteTodo(id) {
    axios.delete(`https://todoo.5xcamp.us/todos/${id}`,{
        headers:{
            'Authorization':token
        } 
    })
    .then((res) => {
        console.log(res,'刪除成功');
        getTodo();
    })
    .catch(error => console.log(error.response))
};
////刪除全部 btn click事件
const deleteAllBtn = document.getElementById('delete-all-btn');
deleteAllBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    //console.log(todoData,777777);
    todoData.forEach((itme) =>{
        if(itme.completed_at !== null){
            deleteTodo(itme.id);
        }
    })
});
//編輯API editTodo()----------
function editTodo(id,todoText){
    axios.put(`https://todoo.5xcamp.us/todos/${id}`,{
        "todo": {
          "content": todoText,
        },
    },{
        headers:{
            'Authorization':token
        } 
    })
    .then((res) => {
        console.log(res,'編輯成功');
        getTodo();
    })
    .catch(error => console.log(error.response))
};

//登出 btn click事件----
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    Swal.fire({
        title: "成功登出?",
        text: "返回首頁!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    setTimeout(()=>{
        logout();        
    },2000)
})
//登出API logout()----------
function logout() {
    axios.delete(`https://todoo.5xcamp.us/users/sign_out`,{
        headers:{
            'Authorization':token
        } 
    })
    .then((response) => {
        console.log(response);
        B.classList.add('d-none');
        A.classList.remove('d-none');
        history.go(0);//重新整理
    })
    .catch(error => console.log(error.response))
}


//註冊頁DOM---------------------------
const signUpEmail = document.getElementById('signup-email');
const signUpNickname = document.getElementById('signup-nickname');
const signUpPassword1 = document.getElementById('signup-password1');
const signUpPassword2 = document.getElementById('signup-password2');
const signUpBtn = document.getElementById('signup-btn');
const goLoginBtn = document.getElementById('go-login-btn');

//登入頁連結 click事件
goLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    //console.log(123);
    C.classList.add('d-none');
    A.classList.remove('d-none');
    history.go(0);//重新整理
});

//註冊頁----//註冊btn click事件
signUpBtn.addEventListener('click', (e) => {
    let eValue = signUpEmail.value.trim();
    let nValue = signUpNickname.value.trim();
    let pValue1 = signUpPassword1.value.trim();
    let pValue2 = signUpPassword2.value.trim();
    
    if(eValue === '' || nValue === '' || pValue1 ==='' || pValue2 === ''){
        Swal.fire({
            title: "請正確輸入?",
            text: "格式不符!",
            icon: "error"
          });
        return ;
    }

    if(pValue1 !== pValue2){
        Swal.fire(   
            "兩次密碼輸入不相同!"
        );
        return ;
    }else{
      signUp(eValue, nValue, pValue1);

      signUpEmail.value = '';
      signUpNickname.value = '';
      signUpPassword1.value = '';
      signUpPassword2.value = '';
    }
})
//------------API---------------//
//註冊API signUp()----------
function signUp(e, n, p) {
    axios.post(`https://todoo.5xcamp.us/users`, {
      "user": {
        "email": e,
        "nickname": n,
        "password": p
      }
    })
    .then((response) => {
        //console.log(response,'======');
        Swal.fire({
            title: "註冊成功",
            text: "歡迎使用",
            icon: "success"
        });
        C.classList.add('d-none');
        A.classList.remove('d-none');
        setTimeout(() =>{
            history.go(0);//重新整理        
        },2000)
    })
    .catch((error) => {
        console.log(error.response);
        Swal.fire("帳號已被註冊!");
        //alert(error.response.data.error);
    });
}