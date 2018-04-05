import 'react-table/react-table.css'
import React from "react";
import ReactTable from "react-table";



export default class TableView extends React.Component {

constructor(props) {
    super(props);
}
    componentDidMount(){
    const{data} = this.props;
    }

render()
    {
        var headerNames = {pl_name: "Summoner Name", kda: "KDA", kills: "Kills (Total)", deaths: "Deaths (Total)", assists: "Assists (Total)",
            kill_participation: "Kill Participation", cs_per_min: "CPSM", cs_total: "CS (Total)", minutes_played: "Minutes Played", games_played: "Games Played",
            rating: "Rating", position: "Position", team_name: "Team Name", ch_name: "Champion Name", win_rate: "Win Rate", pick_rate: "Pick Rate",
            ban_rate: "Ban Rate", game_id: "Game ID", team_red: "Team Red", team_blue: "Team Blue", time: "Date", result: "Result", duration: "Duration",
            patch: "Patch Version", first_blood: "First Blood", total_gold_red: "Total Gold (Red)", total_gold_blue: "Total Gold (Blue)", total_champ_kills: "Total Kills (Champions)",
            head_coach: "Head Coach", wins: "Wins", losses: "Losses", teamkd: "Team KDA", total_kills: "Total Kills", total_deaths: "Total Deaths", total_assists: "Total Assists",
            avg_game_time: "Average Game Time", count: "Count", min: "Min", max: "Max", sum: "Sum", avg: "Average"
        };
        var data = this.props.data;
        console.log("Inside TableView");
        console.log(data);

        var columns = {columns:[]};

        // Populate columns with proper headers
        {
            if (data[0]) {
                Object.keys(data[0]).forEach((key) => {
                console.log(key);
                if(headerNames[key]){
                    columns["columns"].push({Header: headerNames[key], accessor: key})};
                }); 
            }
        }
        console.log(columns);
        return (
            <div>
                <ReactTable
                    columns={columns["columns"]}
                    defaultPageSize={10}
                    data = {data}
                    className="-striped -highlight"
                />
                <br />
            </div>
        );
    }
}

