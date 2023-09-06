const express = require('express');
const router= express.Router();
const fetchuser = require('../midillwere/fetchuser');
const Notes = require('../models/Notes'); 
const { body, validationResult } = require('express-validator');


//Route_1 Fetch All Notes using: Get '/api/notes/fetchallnotes' Login Required
router.get('/fetchallnotes', fetchuser, async (req,res)=>{
  try {
    const notes = await Notes.find({user:req.user.id})
   res.json(notes)
  } catch(error){
    console.error(error.message);
    res.status(500).send('internal sever error');
  }
})

//Route_2 Add new Notes using: Get '/api/notes/addnote' Login Required
router.post('/addnote', fetchuser,[
  body('title','Enter a valid title').isLength({min:4}), 
  body('description','Description must be minimum 6 character').isLength({min:6})
], async (req,res)=>{
  try {
  
  const {title,description,tag}= req.body;
  // If there are errors return Bad request and the errors 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
   const notes =  new Notes({
    title,description,tag,user:req.user.id
   })
   const saveNote = await notes.save();
  res.json(saveNote)
    
} catch(error){
  console.error(error.message);
  res.status(500).send('internal sever error');
}
})

//Route_2 Update Notes using: PUT '/api/notes/updatenote' Login Required
router.put('/updatenote/:id',fetchuser , async(req,res)=>{
  const {title,description,tag} = req.body;
  try {
  //create a new object
  const newNote ={};
  if(title){newNote.title=title};
  if(description){newNote.description=description};
  if(tag){newNote.tag=tag};

  //find the note to be updated and update it
   let note = await Notes.findById(req.params.id);
   if(!note){return res.status(404).send('Not Found')}
   if(note.user.toString() !== req.user.id ){ 
    return res.status(404).send('Not Found')
   }
   note = await Notes.findByIdAndUpdate(req.params.id, {$set:newNote},{note:true})
   res.json({note});
  } catch(error){
    console.error(error.message);
    res.status(500).send('internal sever error');
  }
})

//Route_ Delete Notes using: DELETE '/api/notes/deletenote' Login Required
router.delete('/deletenote/:id',fetchuser , async(req,res)=>{
   try {
  //find the note to be delete and delete it
   let note = await Notes.findById(req.params.id);
   if(!note){return res.status(404).send('Not Found')}

   //Allow deletion only if user own this notes
   if(note.user.toString() !== req.user.id ){ 
    return res.status(404).send('Not Found')
   }
   note = await Notes.findByIdAndDelete(req.params.id)
   res.json({"Success":"note has been deleted" , note:note});
 
  } catch(error){
    console.error(error.message);
    res.status(500).send('internal sever error');
  }
})


module.exports = router 