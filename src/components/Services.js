import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free-solid'
import DataManager from "../api/DataManager";
import Table from "./Table";
import config from "../config";

const Services = () => {

  const [services, setServices] = useState([]);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getServices().then((response) => setServices(response));
  }, []);

  const columns = useMemo(
    () => [

      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: null,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.name,
        id: "action",
        cell: props => (
          <div className="edit-buttons">
            <Link
              className="btn btn-light btn-sm ml-1 mr-1"
              to={"/services/" + props.getValue()}
            >
              <FontAwesomeIcon icon="list" />
            </Link>
          </div>
        ),
        header: () => <span>Description</span>,
        footer: null,
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <div className="mt-4 mx-4">
      <h2 className="view-title">
        <i><FontAwesomeIcon icon="flag" size="lg" /></i>
        <span>Services List</span>
      </h2>
      {services && <Table columns={columns} data={services} />}
    </div>
  );
};



const ServicesDetails = () => {

  let params = useParams();
  const [prefixes, setPrefixes] = useState([]);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getPrefixes().then((response) => setPrefixes(response));
  }, []);

  let servicesDetails = {}
  if (prefixes) {
    prefixes.forEach((p) => {
      if (p["service_name"] === params.name) {
        if (!(p["service_name"] in servicesDetails)) {
          servicesDetails[p["service_name"]] = [p];
        }
        else {
          servicesDetails[p["service_name"]].push(p);
        }
      }
    });
  }

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: null,
      },
      {
        accessorFn: (row) => row.owner,
        id: "owner",
        cell: (info) => info.getValue(),
        header: () => <span>Owner</span>,
        footer: null,
      },
      {
        accessorFn: (row) => row.domain_name,
        id: "domain",
        cell: (info) => info.getValue(),
        header: () => <span>Domain</span>,
        footer: null,
      },
      {
        id: "action",
        cell: props => (

          <div className="edit-buttons">
            <Link className="btn btn-light btn-sm ml-1 mr-1" to={`/prefixes/${props.row.original.id}`} >
              <FontAwesomeIcon icon="list" />
            </Link>
            <Link className="btn btn-light btn-sm ml-1 mr-1" to={`/prefixes/${props.row.original.id}/update`} >
              <FontAwesomeIcon icon="edit" />
            </Link>
            <Link className="btn btn-light btn-sm ml-1 mr-1" to={`/prefixes/${props.row.original.id}/delete`} >
              <FontAwesomeIcon icon="times" />
            </Link>
          </div>
        ),

        header: () => <span>Description</span>,
        footer: null,
        enableColumnFilter: false,
      }
      ,
    ],
    []
  );

  return (
    <>
      <div>
        <span>Prefixes Count:</span>
        <span>{servicesDetails[params.name] && servicesDetails[params.name].length}</span>
      </div>
      <div>
        {servicesDetails[params.name] &&
          <div className="container">
            <div className="row d-flex justify-content-between mb-4">
              <div className="col col-10"></div>
            </div>
            <div className="row d-flex flex-column justify-content-between">
              <Table columns={columns} data={servicesDetails[params.name]} />
            </div>
          </div>
        }
      </div>
    </>
  );
}

export { Services, ServicesDetails };
