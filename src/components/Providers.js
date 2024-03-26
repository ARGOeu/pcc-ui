import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free-solid'
import DataManager from "../api/DataManager";
import Table from "./Table";
import config from "../config";

const Providers = () => {

  const [providers, setProviders] = useState([]);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getProviders().then((response) => setProviders(response));
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
              to={"/providers/" + props.getValue()}
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
          <i><FontAwesomeIcon icon="building" size="lg" /></i>
          <span>Providers List</span>
        </h2>
      {providers && <Table columns={columns} data={providers} />}
    </div>
  );
};

const ProviderDetails = () => {

  let params = useParams();
  const [prefixes, setPrefixes] = useState([]);

  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getPrefixes().then((response) => setPrefixes(response));
  }, []);

  let providersDetails = {}
  if (prefixes) {
    prefixes.forEach((p) => {
      if (p["provider_name"] === params.name) {
        if (!(p["provider_name"] in providersDetails)) {
          providersDetails[p["provider_name"]] = [p];
        }
        else {
          providersDetails[p["provider_name"]].push(p);
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
        <span>{providersDetails[params.name] && providersDetails[params.name].length}</span>
      </div>
      <div>
        {providersDetails[params.name] &&
          <div className="container">
            <div className="row d-flex justify-content-between mb-4">
              <div className="col col-10"></div>
            </div>
            <div className="row d-flex flex-column justify-content-between">
              <Table columns={columns} data={providersDetails[params.name]} />
            </div>
          </div>
        }
      </div>
    </>
  );
}

export { Providers, ProviderDetails };
