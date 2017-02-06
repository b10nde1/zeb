/* 
Ricky Blondel
r2d2 
23-01-2017
*/
        //fonction telecharger en txt
        //besoin de mettre en place le system de input hidden avec les valeurs.
        function downloadFileToTxt(id_in){
            var text="";
            for(var compteur=0;compteur<$("#"+id_in+"").find("tr").length;compteur++){
                text=text+(compteur+1)+"- URL : "+document.getElementById("td_url_"+compteur).value+" || ";
            }
            var file_name="zebu_result_"+new Date().toISOString().slice(0,19)+".txt";
            var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
            saveAs(blob, file_name+".txt");
        }
        //fonction copie
        function copyElement(el){
            var body = document.body, range, sel;
            if (document.createRange && window.getSelection) {
                //definition de la porter de la copie, uniquement les elements dans le tableau mais pas plus
                range = document.createRange();
                sel = window.getSelection();
                sel.removeAllRanges();
                try {
                    range.selectNodeContents(el);
                    sel.addRange(range);
                } catch (e) {
                    range.selectNode(el);
                    sel.addRange(range);
                }
            } else if (body.createTextRange) {
                range = body.createTextRange();
                range.moveToElementText(el);
                range.select();
            }
            document.execCommand("Copy");
        }
        //fonction display loader et block affichage application 
        function displayLoader(to_hide,to_show){
            var div_application=document.getElementById(to_hide),div_loader=document.getElementById(to_show);
            $(div_application).hide(1000);
            $(div_loader).show(1000);
        }
        //centre de l'application => fonction main 
        function startRequest(){
            //init du coeur de l'application
            //obj XMLHttpRequest
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){if(this.readyState == 4 && this.status == 200) {startPrincipalRequest(this);}};
            //recup du fichier, chargement du xml
            var xmlFile=document.getElementById("target").value + ".xml";
            xhttp.open("GET", xmlFile, true);
            xhttp.send();
            function startPrincipalRequest(xml) {
                //affichage du loader le temps de la recuperation des URL - URL uniquement mais sans https || http status
                displayLoader('div_application','div_loader');
                // reset le cookie, les result de l'ajax - les results de l'ajax sont dans le cookie pour ne pas etre forcer de mettre en place une promise ou un callback
                document.cookie = " Status code =;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                //init des variables
                var xmlDoc = xml.responseXML;
                var compteur=0, init_table="<table><thead><th>URL</th><th>Https||Http</th><th>Code</th></thead><tbody id='table_result'>",listOfUrl=" ", compteurEndOfData=0,compteurTotalHttps=0,compteurTotalHttp=0;
                //recuperation de l'indice de recherche si le champ n'est pas vide
                var queryArgument=document.getElementById("queryWhere").value;
                var queryWhere=new RegExp(queryArgument,"gi");
                while(compteurEndOfData<xmlDoc.getElementsByTagName("loc").length){
                    //recuperation des lien / node dans le xml
                    var tempData = xmlDoc.getElementsByTagName("loc")[compteurEndOfData].childNodes[0].nodeValue;
                    if(tempData.match(queryWhere)!=null){
                        //check si http ou https - voire fonction checkIfHttps - utilisation de RegExp
                        var tempHttpsResult=checkIfHttps(tempData), tempStatus="https";
                        if(tempHttpsResult==false)tempStatus="http";
                        //init ligne du tableau pour les result
                        listOfUrl=listOfUrl+"<tr><td id='url"+compteurEndOfData+"'>"+splitUrl(tempData,tempStatus)+"</td><td id='http"+compteurEndOfData+"' style='display: table-cell'>"+tempStatus+"</td><td id='status"+compteurEndOfData+"'></td></tr>";
                        //appel de la fonction pour verification du code http si 200 ou 404 - voir checkPageStatus, utilisation de AJAX 
                        //- besoin de mettre en place un serveur car l'interpretation du code est diff / serveur, prepros => 200||404 ; MAMP=> 200 sql...||404sql...
                        checkPageStatus(tempData,compteurEndOfData,tempStatus, function(status){
                            if(status === 200){
                                console.log("200");
                            }
                            else if(status === 404){
                                console.log("404");
                            }
                        });
                        compteur++;
                        //compte le nombre de http et https
                        if(tempHttpsResult==true)compteurTotalHttps++;
                        else if(tempHttpsResult==false)compteurTotalHttp++;
                    }
                    compteurEndOfData++;
                }
                console.log("Test completed");
                //ajout des resultats dans l'interface
                //fermeture du tablea
                document.getElementById("upData").innerHTML =init_table+listOfUrl+"</tbody></table>";
                document.getElementById("totalUrl").innerHTML=compteur;
                document.getElementById("totalUrlTested").innerHTML=compteurEndOfData;
                document.getElementById("totalUrlHttps").innerHTML=compteurTotalHttps;
                document.getElementById("totalUrlHttp").innerHTML=compteurTotalHttp;
                //affichage des boutons sous le tableau de resultat total
                document.getElementById("div_option_all").style.display="block";
                //fin de la recuperation des URL, le loader est cacher.
                displayLoader("div_loader","div_application");
            }
        }
        //split avancer
        function splitUrl(url_arg,split_arg){
            //retire le http ou https devant l'url
            var split_coma = url_arg.split(split_arg+"://");
            return split_coma[1];
        }
        //verification si la page vas sur 404 ou 500
        function checkPageStatus(url,id_td,http_https, cb){
            $.ajax({
                //dans le cas d'une utilisation sans serveur, mettre async false pour permetre a l'application de correctement recuperer le code status
                //remarque : async false implique une tres long duree d'attente...
                //async: false,
                url: url,
                dataType: 'text',
                type: 'GET',
                complete:  function(xhr){
                    if(typeof cb === 'function')cb.apply(this, [xhr.status]);
                    //le code est mis en cache
                    document.cookie=xhr.status;
                    //si 404
                    //ajouter un element dans la liste des 404
                    //ajouter un lien dans le tableau 
                    //mettre le status 404 dans le tableau principale en rouge
                    //afficher l'option de copie sous le tableau 
                    if(document.cookie=="404"){
                        document.getElementById("status"+id_td).style.backgroundColor="red";
                        document.getElementById("url"+id_td).innerHTML="<a href='#' onclick='openUrlNewTab(\""+url+"\")'>"+splitUrl(url,http_https)+"</a>";
                        document.getElementById("upDataError").innerHTML+="<p><a href='#' onclick='openUrlNewTab(\""+url+"\")'>"+splitUrl(url,http_https)+"</a></p>";
                        document.getElementById("div_option_404").style.display="block";
                    }
                    //mettre le code 404||200 dans le tableau
                    document.getElementById("status"+id_td).innerHTML=document.cookie;
                }
            });
        }
        //ouvre un nouveau onglet au click du lien
        function openUrlNewTab(url){
            var temp_url=window.open(url);
            temp_url.focus();
        }
        //verification hppt||https
        function checkIfHttps(value){
            //mise en place du RegExp, recupere uniquement http|| https
            var urlregex = new RegExp("^(https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
            if (urlregex.test(value))return (true);
            return (false);
        }