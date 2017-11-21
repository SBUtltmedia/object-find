<?


//print_r($_POST);
$fileName =$_POST['room'].".json";
$JSON=json_decode(file_get_contents($fileName));

foreach($JSON->targets as $value){

if($value->Name==$_POST['name']){
$value->Text[$_POST['phase']]=$_POST['text'];
file_put_contents($fileName,json_encode($JSON));
print("saved");
}


}





?>
