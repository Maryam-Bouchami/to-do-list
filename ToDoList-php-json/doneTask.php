<?php
if (empty($_POST)) {
    echo "Aucune donnée reçue";
}
else {
	//enregistrer la nouvelle liste dans un fichier a part
	/*$listeName=$_POST['titre'].".json";
	file_put_contents($listeName,json_encode($_POST));*/
	
	// enregistrer la liste dans  le ficher qui contient toutes les lstes
    $datalist = json_decode(file_get_contents('list.json'));
	
	///////////////////////
	    $index=0;

    $id=$_POST['listID'];
	$doneTasks=$_POST['doneTasks'];
    for ($i=0; $i<sizeof($datalist);$i++){
 	if ($datalist[$i]->listID==$id){
			$exist=true;
		//remplacer par la nouvelle liste 
		   $datalist[$i]->doneTasks=$doneTasks;
		}

}


	//////////////////////
		
	$data=json_encode( $datalist ); 

	
	file_put_contents("list.json", $data);
	}




