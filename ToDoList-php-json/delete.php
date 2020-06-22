<?php
if (empty($_POST)) {
    echo "Aucune donnée reçue";
}
else {
    
    $datalist = json_decode(file_get_contents('list.json'));
    $index=0;
    $id=$_POST['id'];

     for ($i=0; $i<sizeof($datalist);$i++){
 	if ($datalist[$i]->listID==$id){
			
			array_splice($datalist, $i, 1);
		}
}
	$data=json_encode( $datalist );
	file_put_contents("list.json", $data);
	} 

