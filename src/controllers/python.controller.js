let {PythonShell} = require('python-shell');

const UsersCtrl = {};
UsersCtrl.postMain = async (req, res) => {
    try{
        const response=req.body;

        /*PARSE*/
        //console.log(response.data);
        PythonShell.runString(response.data, null, function (err, results) {
          if (err) throw err;
          res.json({message:results});

        });
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
