const UsersCtrl = {};
UsersCtrl.postMain = async (req, res) => {
    try{
        const response=req.body;

        /*PARSE*/
        console.log(response.data);
        res.json({message:'PAYASO'});


    }catch(error){
        res.status(400).json({ message: 'Error' });
    }
}
UsersCtrl.getMain = async (req, res) => {
    try{
      res.status(200).json({message: 'get method'});
    }catch(error){
        res.status(400).json({message: 'Error'});
    }
};

module.exports = UsersCtrl;
