import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../Alert";
import DataManager from "../../api/DataManager";
import config from "../../config";
import { EditStats } from "./info"


const PrefixEditStats = () => {
    let params = useParams();
    let navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [prefixName, setPrefixName] = useState("");

    const [prefixes, setPrefixes] = useState([]);
    const [prefixStatistics, setPrefixStatistics] = useState({});

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value || 0;
        setPrefixStatistics({
            ...prefixStatistics,
            [name]: parseInt(value, 10)
        });
    };

    useEffect(() => {
        let DM = new DataManager(config.endpoint);
        DM.getPrefixes().then((response) => setPrefixes(response));
    }, []);

    useEffect(() => {
        let DM = new DataManager(config.endpoint);
        let prefix = {};
        if (prefixes) {
            prefixes.forEach((p) => {
                if (String(p.id) === params.id) {
                    prefix = p;
                }
            });
        }
        setPrefixName(prefix.name);

        if (prefix.name !== undefined) {
            DM.getStatisticsByPrefixID(prefix.name)
                .then((response) => {
                    if (response && Object.keys(response).length > 0) {
                        setPrefixStatistics({
                            ["handles_count"]: parseInt(response.handles_count || 0, 10),
                            ["resolvable_count"]: parseInt(response.resolvable_count || 0, 10),
                            ["unresolvable_count"]: parseInt(response.unresolvable_count || 0, 10),
                            ["unchecked_count"]: parseInt(response.unchecked_count || 0, 10),
                        });
                    } else {
                        setPrefixStatistics({});
                    }
                })
                .catch((error) => console.error("Error fetching statistics:", error));
        }
    }, [prefixes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const stats = {
            ["handles_count"]: prefixStatistics.handles_count.toString(),
            ["resolvable_count"]: prefixStatistics.resolvable_count.toString(),
            ["unresolvable_count"]: prefixStatistics.unresolvable_count.toString(),
            ["unchecked_count"]: prefixStatistics.unchecked_count.toString()
        }
        let DM = new DataManager(config.endpoint);
        DM.updateStatisticsByPrefixID(prefixName, stats).then((r) => {
            setAlert(true);
            if (!("message" in r)) {
                setAlertType("success");
                setAlertMessage("Prefix succesfully updated.");
                setTimeout(() => {
                    navigate("/prefixes/");
                }, 2000);
            }
            else {
                setAlertType("danger");
                setAlertMessage(r["message"]);
            }
        });
    };

    return (
        <div className="container" >
            {alert &&
                <Alert type={alertType} message={alertMessage} />
            }
            <form onSubmit={handleSubmit}>
                <div className="row col-md-4 mt-4 text-start" >
                    <h2>Edit Statistics</h2>
                    <div className="form-group">
                        <legend>Prefix Statistics</legend>
                        <div className="form-row ">
                            <div className=" mb-3">
                                <label htmlFor="handles" className="form-label fw-bold mt-2">{EditStats.handles.label}</label>
                                <span className="info-icon"> i
                                    <span className="info-text">
                                        {EditStats.handles.info}
                                    </span>
                                </span>
                                <input type="number" id="handles_count" name="handles_count" className={`form-control`} min="0" value={!isNaN(prefixStatistics.handles_count) ? parseInt(prefixStatistics.handles_count, 10).toString() : ""} onChange={handleChange} />
                                <label htmlFor="resolvable" className="form-label fw-bold mt-2">{EditStats.resolvable.label}</label>
                                <span className="info-icon"> i
                                    <span className="info-text">
                                        {EditStats.resolvable.info}
                                    </span>
                                </span>
                                <input type="number" id="resolvable_count" name="resolvable_count" className={`form-control`} min="0" value={!isNaN(prefixStatistics.resolvable_count) ? parseInt(prefixStatistics.resolvable_count, 10).toString() : ""} onChange={handleChange} />
                                <label htmlFor="non-resolvable" className="form-label fw-bold mt-2">{EditStats.nonResolvable.label}</label>
                                <span className="info-icon"> i
                                    <span className="info-text">
                                        {EditStats.nonResolvable.info}
                                    </span>
                                </span>
                                <input type="number" id="unresolvable_count" name="unresolvable_count" className={`form-control`} min="0" value={!isNaN(prefixStatistics.unresolvable_count) ? parseInt(prefixStatistics.unresolvable_count, 10).toString() : ""} onChange={handleChange} />
                                <label htmlFor="unchecked" className="form-label fw-bold mt-2">{EditStats.unchecked.label}</label>
                                <span className="info-icon"> i
                                    <span className="info-text">
                                        {EditStats.unchecked.info}
                                    </span>
                                </span>
                                <input type="number" id="unchecked_count" name="unchecked_count" className={`form-control`} min="0" value={!isNaN(prefixStatistics.unchecked_count) ? parseInt(prefixStatistics.unchecked_count, 10).toString() : ""} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-md-4 text-end" >
                    <button type="submit" value="Submit" className="btn btn-primary" style={{ marginRight: "1rem" }}>Update</button>
                    <button type="reset" className="btn btn-dark" onClick={() => { navigate("/prefixes/"); }}>Back</button>
                </div>
            </form>
        </div>

    );
};

export default PrefixEditStats;