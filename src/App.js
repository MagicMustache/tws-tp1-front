import './App.css';
import React, {useState} from "react";
const axios = require("axios").default;

function App() {

    const [loaded, setloaded] = useState(false)
    const [tracks, setTracks] = useState([])
    const [table, setTable] = useState([])
    const [table2, setTable2] = useState([])
    const [currentTrack, setCurrentTrack] = useState("")


    function getTracks(){
            axios.get("http://localhost:2999/tracks").then((res)=>{
                console.log(res.data)
                if(res.data.length>0){
                    setTracks(res.data)
                }
            })
        }

    function getTrackPoints(id, name){
        axios.get("http://localhost:2999/tracks/"+id).then((res)=>{
            console.log(res.data)
            setTable(tableGeneration(res.data, name))
            setCurrentTrack(id)
        }).catch((e)=>{
            console.log(e)
        })

    }

    function getDBpedia(id){
        axios.get("http://localhost:2999/tracks/"+id+"/dbpedia").then((res)=>{
            if(res.data.length>0){
                console.log(res.data)
                setTable2(table2Generation(res.data,1))
            }
            else{
                setTable2(table2Generation(res.data,2))
            }
        })
    }
    getTracks()

    if(tracks.length>0){
        let table1, table3
        if(table){
             table1 = table
        }
        if(table2){
            table3=table2
        }
        else{
            table1 = ""
            table3 = ""
        }
        return (
            <div className="App" style={{backgroundColor: "#649cf5"}}>
                <div id={"test"} style={{backgroundColor: "#649cf5", width:"100%", margin:"auto",height:"400vh"}}>
                    <h1>Projet 1 de TWS</h1>
                    <h2>Milo Gianinazzi & Philippe Weidmann</h2>
                    <div style={{}}>
                        {tracks.map((d,idx)=>{
                            return(
                                <li key={idx} style={{listStyle:"none"}}><button class={"link"} style={{fontSize:"20px"}} onClick={()=>{getTrackPoints(d.id, d.name)}}>{d.name}</button></li>
                            )
                        })}
                    </div>
                    <br/>
                    <button onClick={()=>{getDBpedia(currentTrack)}}>Plus d'informations</button>
                    <br/>
                    <div style={{float:"left", width:"60%"}}>
                        <table style={{marginLeft:"10pt",float:"left"}}>
                            {table1}
                        </table>
                    </div>
                    <div style={{float:"left", width:"40%"}}>
                        <table style={{float:"left", marginLeft:"10pt"}}>
                            {table3}
                        </table>
                    </div>

                </div>
            </div>
        );
    }
    else{
        return(
            <div className={"App"}>
                <h1>Loading</h1>
            </div>
        )
    }
}
function tableGeneration(trkpoints, name){
    let rows = []
    rows.push(<caption style={{fontSize:"30px", fontWeight:"bold"}}>{name}</caption>)
    rows.push(<tr><th>Lat</th><th>Lon</th><th>Waypoint name</th><th>Point of interest name</th><th>Point of interest type</th></tr>)
    for (let i = 0;i<trkpoints.length;i++){
        let children = []
        children.push(<td>{trkpoints[i].lat}</td>)
        children.push(<td>{trkpoints[i].lon}</td>)
        if(trkpoints[i].waypointName){
            children.push(<td>{trkpoints[i].waypointName}</td>)
        }
        else{
            children.push(<td>N/A</td>)
        }
        if(trkpoints[i].poiName){
            children.push(<td>{trkpoints[i].poiName}</td>)
        }
        else{
            children.push(<td>N/A</td>)
        }
        if(trkpoints[i].poiType){
            children.push(<td>{trkpoints[i].poiType}</td>)
        }
        else{
            children.push(<td>N/A</td>)
        }
        rows.push(<tr>{children}</tr>)
    }

    return rows
}
function table2Generation(data, type){
    let rows = []
    if(type===1){
        rows.push(<caption style={{fontSize:"30px", fontWeight:"bold"}}>Informations DBpedia</caption>)
        rows.push(<tr><th>Lat</th><th>Lon</th><th>Name</th><th>Abstract</th></tr>)
        for (let i=0;i<data.length;i++){
            let children=[]
            children.push(<td>{data[i].lat}</td>)
            children.push(<td>{data[i].lon}</td>)
            children.push(<td>{data[i].name}</td>)
            children.push(<td>{data[i].abstract}</td>)
            rows.push(<tr>{children}</tr>)
        }
    }
    else{
        rows.push(<caption style={{fontSize:"30px", fontWeight:"bold"}}>Pas d'informations DBpedia</caption>)
    }
    return rows
}

export default App;