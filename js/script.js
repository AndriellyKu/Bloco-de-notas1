const addNote = document.querySelector('#add-note');
const closeModal =  document.querySelector('#close-modal');
const modal = document.querySelector('#modal');
const modalView = document.querySelector('#modal-view'); 
const notes = document.querySelector('#notes');
const btnSaveNote = document.querySelector("#btn-save-note");
const btnCloseNote = document.querySelector("#btn-close-note");
const btnDelete = document.querySelector("#deletar-nota");
const btnEdit = document.querySelector('#editar-nota');


///////////////////////////////EVENTOS////////////////////////////////


addNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    console.log("Botão abrindo!");
    notes.style.display='none';
    modal.style.display='block';
    addNote.style.display='none';
});

btnCloseNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    console.log("Botão fechando!");
    notes.style.display="flex";
    modal.style.display="none";
    addNote.style.display='block';
    document.querySelector('.texto-aviso').style.display = 'none';

    document.querySelector('#input-id').value = "";
    document.querySelector('#input-title').value = "";
    document.querySelector('#input-content').value = "";
    console.log("fechou");
    loadNotes();
    listNotes();
});

btnSaveNote.addEventListener("click", (evt) => {
    evt.preventDefault();
    let data = {
        id: document.querySelector("#input-id").value,
        title:document.querySelector("#input-title").value,
        content:document.querySelector("#input-content").value,
    };
    saveNote(data);
});


/////////////////////////////////////FUNÇÕES/////////////////////////////


const saveNote = (note) => {
    let notes = loadNotes();
    note.lastTime = new Date().getTime();
    // console.log(note.lastTime);
    if(note.id.length > 0){
        note.id = parseInt(note.id);
        notes.forEach((item, i) => {
            if(item.id == note.id){
                notes[i] = note;
            }
        })
    }else{
        note.id = new Date().getTime();
        document.querySelector('#input-id').value = note.id;
        notes.push(note);
    }

    notes = JSON.stringify(notes);

    localStorage.setItem('notes', notes);
};

const deleteNote = (note) => {
    let notes = loadNotes();
    note.id = parseInt(note.id);
    notes.forEach((item, i) => {
        if(item.id == note.id){
            notes.splice(i, 1);
        }
    })
    notes = JSON.stringify(notes);
    localStorage.setItem('notes', notes);
    listNotes();
}

const loadNotes = () => {
    let notes = localStorage.getItem('notes');
    if(notes === null || (notes && JSON.parse(notes).length === 0)){
        notes = [];
        } else {
        notes = JSON.parse(notes);
    }
    return notes;
};

const listNotes = () => {
    let listNotes = localStorage.getItem('notes');
    listNotes = JSON.parse(listNotes);
    notes.innerHTML = "";
    listNotes.forEach((item) => {
        const divCard = document.createElement('div');
        divCard.className = 'card item-cartao';
        const divCardBody = document.createElement('div');
        divCardBody.className = 'card-body carton';
        const h1 = document.createElement('h1');
        h1.className = 'card-title text-light';
        h1.innerText = item.title;
        const pContent = document.createElement('p');
        pContent.className = 'card-text text-light';
        pContent.innerText = item.content;

        const pLastTime = document.createElement('p');
        let lastTime = new Date(item.lastTime).toLocaleDateString('pt-BR');
        pLastTime.innerText = `Last uptade: ${lastTime}`;
        pLastTime.className = 'text-light';


        divCardBody.appendChild(h1);
        divCardBody.appendChild(pContent);
        divCardBody.appendChild(pLastTime);
        divCard.appendChild(divCardBody);
        notes.appendChild(divCard);

        divCard.addEventListener("click", (evt) => {
            evt.preventDefault();
            showNote(item);
        });

        closeModal.addEventListener("click", (evt) => {
            evt.preventDefault();
            notes.style.display = 'flex';
            modalView.style.display = 'none';
            addNote.style.display = 'block';
            document.querySelector('.texto-aviso').style.display = 'none';
            loadNotes();
        });
    });
};

let currentNote = null;
let deleteListenerAdded = false;


const deleteNoteConfirm = (evt) => {
    evt.preventDefault();
    if (currentNote && confirm("Certeza que quer deletar essa nota?")) {
        deleteNote(currentNote);
        console.log("Você confirmou!");
        notes.style.display = 'flex';
        modalView.style.display = 'none';
        addNote.style.display = 'block';
        loadNotes();
        listNotes();
    } else {
        console.log("Você cancelou!");
    }
};

const showNote = (note) => {
    notes.style.display = 'none';
    modalView.style.display = 'block';
    addNote.style.display = 'none';
    currentNote = note;

    document.querySelector('#title-note').innerHTML = "<h1>"+note.title+"</h1>";
    document.querySelector('#content-note').innerHTML = "<p>"+note.content+"</p>";
    document.querySelector('#content-note').innerHTML += "<p>Last update: "+new Date(note.lastTime).toLocaleDateString('pt-BR')+"</p>";

    btnEdit.addEventListener("click", (evt) => {
        evt.preventDefault();

        notes.style.display='none';
        modal.style.display='block';
        modalView.style.display = 'none';

        document.querySelector('#input-id').value = note.id;
        document.querySelector('#input-title').value = note.title;
        document.querySelector('#input-content').value = note.content;
    });

    if (deleteListenerAdded) {
        btnDelete.removeEventListener("click", deleteNoteConfirm);
    }

    btnDelete.addEventListener("click", deleteNoteConfirm);
    deleteListenerAdded = true;
};

loadNotes();
listNotes();
