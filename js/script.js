const __tBody = document.querySelector("#tbody");
const __modalBtn = document.querySelector("#modalBtn");
const __modal = document.querySelector("#modal");
const __form = document.querySelector("#form");
const url = "https://63d7c7c25c4274b136fb4bd7.mockapi.io/user";

window.onload = async () => {
    render(await readData())
}

const onSubmit = async (e)=>{
    e.preventDefault()
    const { name, age, job, salary } = e.target.elements;
    const multifunctionalData = {
        name: name.value,
        age: age.value,
        job: job.value,
        salary: salary.value
    }
    if (e.target.dataset.type) {
        await updateData(multifunctionalData, e.target.dataset.type)
        e.target.removeAttribute('data-type')
    }
    else {
        await createUser(multifunctionalData);
    }
    btnClose.addEventListener('click', () => __modal.classList.add('hidden'))
    __modal.classList.add('hidden')
    e.target.reset()
//   e.preventDefault();
//   const {name, age, job, salary} = e.target.elements;
//     const postData = {
//         name: name.value,
//         age: age.value,
//         job: job.value,
//         salary: salary.value
//     }
    
    
    
//     createUser(postData)
//     __modal.classList.add("hidden")
}

__form.addEventListener("submit", onSubmit)

// ||------------------CRUD-----------------------||
async function createUser(user) {
    loading(true)
    try {
        const JsonData = JSON.stringify(user);
        const response = await fetch(url, {
            method: "POST",
            body: JsonData,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            
        })

        render(await readData())
    } catch (error) {
        errorDisplay(error.message)
    }
}

async function readData (){
    loading(true)
    try {
        const response = await fetch(url);
        const body = await response.json();
        loading(false)
        return body;
    } catch (error) {
        errorDisplay(error.message)
    }
}

async function updateData(user, id) {
    loading(true)
    try {
        const JsonData = JSON.stringify(user);
        const response = await fetch(`${url}/${id}`, {
            method: "PUT",
            body: JsonData,
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            
        })
        render(await readData())
    } catch (error) {
        errorDisplay(error.message)
    }
}

async function deleteUser(id) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
        })
        render(await readData())
    } catch (error) {
        errorDisplay(error.message)
    }
}
// ||---------------------------------------------||


function errorDisplay(message) {
    document.body.innerHTML = `
    <div class="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-red-100">
    <h1 class="text-red-500 uppercase text-4xl">${message}</h1>
    </div>
    `
}

function loading(state){
    
   const __loading = document.querySelector("#loading")
    
    if(state){
        __loading.classList.add("block")
    }
    else{
        __loading.classList.add("hidden")
    }
}

async function setAttrbuteByIdToForm(id) {
    __form.setAttribute("data-type", id)
    __modal.classList.remove("hidden");
    const {name, age, job, salary} = __form.elements;
    const user = await readData().then(res=>res.find(el=>el.id));
    name.value = user.name;
    age.value = user.age;
    job.value = user.job;
    salary.value = user.salary;
    
}

function render(users) {
    let html = ""
    users?.forEach(user => {
        html += `<tr class="bg-gray-300 border border-grey-500 md:border-none block md:table-row">
        <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell"><span
                class="inline-block w-1/3 md:hidden font-bold">Name</span>${user.name}</td>
        <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell"><span
                class="inline-block w-1/3 md:hidden font-bold">Age</span>${user.age}</td>
        <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell"><span
                class="inline-block w-1/3 md:hidden font-bold">Job</span>${user.job}</td>
        <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell"><span
                class="inline-block w-1/3 md:hidden font-bold">Salary</span>${user.salary}</td>
        <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
            <span class="inline-block w-2/3 md:hidden font-bold">Actions</span>
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-5 border border-blue-500 rounded" onclick="setAttrbuteByIdToForm(${user.id})">Edit</button>
            <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-4 border border-red-500 rounded" onclick="deleteUser(${user.id})">Delete</button>
        </td>
    </tr>
    
`;
    });

    __tBody.innerHTML = html
}




__modalBtn.addEventListener("click", ()=>{
        __modal.classList.remove("hidden")
})

__modal.addEventListener("click", (e)=>{
    if(e.target.matches("#modal") || e.target.matches("#btnClose")){
        __modal.classList.add("hidden")
    }
})
