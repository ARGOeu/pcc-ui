import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../Alert";

import moment from 'moment'

import { Controller, useForm } from "react-hook-form";
import DatePicker from 'react-datepicker';

import DataManager from "../../api/DataManager";
import config from "../../config";
import { PrefixLabels } from "./info"


const status_t = {
  "0": "Missing",
  "1": "Exists"
};

const contract_type_t = {
  "CONTRACT": "CONTRACT",
  "PROJECT": "PROJECT",
  "OTHER": "OTHER"
};

const PrefixAdd = () => {
  let navigate = useNavigate();

  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const dateFormat = "YYYY-MM-DD[T]HH:mm:ss[Z]"
  const [formDefaultValues, setDefaultFormValues] = useState({
    service_id: [],
    provider_id: [],
    domain_id: [],
    status: "",
    owner: "",
    contact_name: "",
    contact_email: "",
    contract_end: "",
    contract_type: "",
    lookup_service_type: ""
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return formDefaultValues;
    }, [formDefaultValues]),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const [providers, setProviders] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getProviders().then((response) => {
      setProviders(response);
    });
  }, []);

  const [domains, setDomains] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getDomains().then((response) => {
      setDomains(response);
    });
  }, []);

  const [services, setServices] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getServices().then((response) => {
      setServices(response);
    });
  }, []);

  const [lookup_service_types, setLookUpServiceTypes] = useState([]);
  useEffect(() => {
    let DM = new DataManager(config.endpoint);
    DM.getReverseLookUpTypes().then((response) => {
      setLookUpServiceTypes(response);
    });
  }, []);

  useEffect(() => {
    setDefaultFormValues(
      {
        ...formDefaultValues,
        ...{
          lookup_service_type: (lookup_service_types && lookup_service_types.length > 0 ? "" : formDefaultValues.lookup_service_type)
        }
      }
    );
    reset(
      {
        ...formDefaultValues,
        ...{
          lookup_service_type: formDefaultValues.lookup_service_type
        }
      }
    );
  }, [lookup_service_types]);

  const onformSubmit = (data) => {
    if (data["contract_end"] !== null && data["contract_end"] !== "") {
      data["contract_end"] = moment(data["contract_end"]).format(dateFormat);
    }
    if (data["provider_id"].length == 0){
      data["provider_id"] = "";
    }
    if (data["domain_id"].length == 0){
      data["domain_id"] = "";
    }
    if (data["service_id"].length == 0){
      data["service_id"] = "";
    }
    let DM = new DataManager(config.endpoint);
    DM.addPrefix(data).then((r) => {
      setAlert(true);
      if (!("message" in r)) {
        setAlertType("success");
        setAlertMessage("Prefix succesfully created.");
        setTimeout(() => {
          navigate("/prefixes/");
        }, 2000);
      }
      else {
        setAlertType("danger");
        setAlertMessage(r["message"]);
      }
    })
  };

  const lookup_service_type_select = (
    <>
      <label htmlFor="status" className="form-label fw-bold">
        {PrefixLabels.lookupType.label}
      </label>
      <span className="info-icon"> i
        <span className="info-text">
          {PrefixLabels.lookupType.info}
        </span>
      </span>
      <select
        className={`form-select ${errors.lookup_service_type ? "is-invalid" : ""}`}
        id="lookupServiceType"
        {...register("lookup_service_type", { required: false })}>
        <option value="">
          Select Type
        </option>
        {lookup_service_types &&
          lookup_service_types.map((t, i) => {
            return (
              <option key={`type-${i}`} value={t}>
                {t}
              </option>
            );
          })}
      </select>
      {errors.lookup_service_type && (
        <div className="invalid-feedback">Lookup Service Type must be selected</div>
      )}
    </>
  );

  // if (providers) {
  return (
    <div className="container">
      {alert &&
        <Alert type={alertType} message={alertMessage} />
      }
      <form onSubmit={handleSubmit(onformSubmit)}>
        <div className="row mt-4 text-start">
          <h2>Create new prefix</h2>
          <p className="text-muted"><span className="required">*</span>Indicates a required field</p>
          <div className="form-group">
            <legend>Prefix Details</legend>
            <div className="form-row">
              <div className="mb-3">
                <label htmlFor="prefixName" className="form-label fw-bold">
                  <span className="required">*</span>
                  {PrefixLabels.name.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.name.info}
                  </span>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="prefixName"
                  aria-describedby="prefixNameHelp"
                  {...register("name", {
                    required: { value: true, message: "Name is required" },
                    minLength: { value: 3, message: "Minimum length is 3" }
                  })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="owner" className="form-label fw-bold">
                  <span className="required">*</span>
                  {PrefixLabels.owner.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.owner.info}
                  </span>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.owner ? "is-invalid" : ""}`}
                  id="owner"
                  {...register("owner", {
                    required: { value: true, message: "Owner is required" },
                    minLength: { value: 3, message: "Minimum length is 3" }
                  })}
                />
                {errors.owner && <div className="invalid-feedback">{errors.owner.message}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="mb-3">
                <label htmlFor="prefixContactName" className="form-label fw-bold">
                  <span className="required">*</span>
                  {PrefixLabels.contactName.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.contactName.info}
                  </span>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.contact_name ? "is-invalid" : ""}`}
                  id="prefixContactName"
                  aria-describedby="prefixContactNameHelp"
                  {...register("contact_name", {
                    required: { value: true, message: "Contact Name is required" },
                    minLength: { value: 3, message: "Minimum length is 3" }
                  })}
                />
                {errors.contact_name && <div className="invalid-feedback">{errors.contact_name.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="prefixContactEmail" className="form-label fw-bold">
                  <span className="required">*</span>
                  {PrefixLabels.contactEmail.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.contactEmail.info}
                  </span>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.contact_email ? "is-invalid" : ""}`}
                  id="prefixContactEmail"
                  aria-describedby="prefixContactEmailHelp"
                  {...register("contact_email", {
                    required: { value: true, message: "Contact Email is required" },
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format"
                    }
                  })}
                />
                {errors.contact_email && <div className="invalid-feedback">{errors.contact_email.message}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="usedBy" className="form-label fw-bold">
                {PrefixLabels.usedBy.label}
              </label>
              <span className="info-icon"> i
                <span className="info-text">
                  {PrefixLabels.usedBy.info}
                </span>
              </span>
              <input
                type="text"
                className={`form-control ${errors.used_by ? "is-invalid" : ""}`}
                id="usedBy"
                {...register("used_by", {
                  required: { value: false, message: "Used By is required" },
                  minLength: { value: 3, message: "Minimum length is 3" }
                })}
              />
              {errors.used_by && <div className="invalid-feedback">{errors.used_by.message}</div>}
            </div>
          </div>
          <div className="form-group">
            <legend>Service specific Information </legend>
            <div className="form-row">
              <div className="mb-3">
                <label htmlFor="serviceID" className="form-label fw-bold">
                  {PrefixLabels.service.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.service.info}
                  </span>
                </span>
                <select
                  className={`form-select ${errors.service_id ? "is-invalid" : ""}`}
                  id="serviceID"
                  {...register("service_id", { required: false })}>
                  <option value="">
                    Select Service
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}{" "}
                    </option>
                  ))}
                </select>
                {errors.service_id && (
                  <div className="invalid-feedback">Service must be selected</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="providerID" className="form-label fw-bold">
                  <span className="required">*</span>
                  {PrefixLabels.provider.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.provider.info}
                  </span>
                </span>
                <select
                  className={`form-select ${errors.provider_id ? "is-invalid" : ""}`}
                  id="providerID"
                  {...register("provider_id", { required: true })}>
                  <option value="">
                    Select Provider
                  </option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
                {errors.provider_id && (
                  <div className="invalid-feedback">Provider must be selected</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="domainID" className="form-label fw-bold">
                  {PrefixLabels.domain.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.domain.info}
                  </span>
                </span>
                <select
                  className={`form-select ${errors.domain_id ? "is-invalid" : ""}`}
                  id="domainID"
                  {...register("domain_id", { required: false })}>
                  <option value="">
                    Select Domain
                  </option>
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}{" "}
                    </option>
                  ))}
                </select>
                {errors.domain_id && <div className="invalid-feedback">Domain must be selected</div>}
              </div>
            </div>


          </div>
          <div className="form-group">
            <legend>Contract Details</legend>
            <div className="form-row">
              <div className="mb-3">
                <label htmlFor="prefixContractEndDate" className="form-label fw-bold">
                  {PrefixLabels.contractEndDate.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.contractEndDate.info}
                  </span>
                </span>
                <Controller
                  control={control}
                  name='contract_end'
                  render={({ field }) => (
                    <DatePicker
                      className={`form-control ${errors.contract_end ? "is-invalid" : ""}`}
                      placeholderText='Select date'
                      onChange={(date) => { field.onChange(date) }}
                      selected={field.value}
                    />
                  )}
                />
                {errors.contract_end && <div className="invalid-feedback">{errors.contract_end.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="prefixContractType" className="form-label fw-bold">
                  {PrefixLabels.contractType.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.contractType.info}

                  </span>
                </span>
                <select
                  className={`form-select ${errors.contract_type ? "is-invalid" : ""}`}
                  id="prefixContractType"
                  {...register("contract_type", { required: false })}>
                  <option value="">
                    Select Contract Type
                  </option>
                  {Object.entries(contract_type_t).map((contract) => (
                    <option key={"contract-" + contract[0]} value={contract[0]}>
                      {contract[0]}
                    </option>
                  ))}
                </select>
                {errors.contract_type && <div className="invalid-feedback">{errors.contract_type.message}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="mb-3">
                {lookup_service_types && lookup_service_types.length > 0
                  ? lookup_service_type_select
                  : null}
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label fw-bold">
                  {PrefixLabels.status.label}
                </label>
                <span className="info-icon"> i
                  <span className="info-text">
                    {PrefixLabels.status.info}
                  </span>
                </span>
                <select
                  className={`form-select ${errors.status ? "is-invalid" : ""}`}
                  id="status"
                  {...register("status", { required: false })}>
                  <option value="">
                    Select Status
                  </option>
                  <option key="status-0" value="1">
                    {status_t["1"]}
                  </option>
                  <option key="status-1" value="0">
                    {status_t["0"]}
                  </option>
                </select>
                {errors.status && <div className="invalid-feedback">Status must be selected</div>}
              </div>
            </div>
          </div>
          <div className="row text-end">
            <div className="column col-10"></div>
            <div className="column col-2 d-flex justify-content-end">
              <button
                type="submit"
                value="Submit"
                className="btn btn-primary"
                style={{ marginRight: "1rem" }}>
                Create
              </button>
              <button
                onClick={() => {
                  navigate("/prefixes/");
                }}
                className="btn btn-dark">
                Back
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
  // } else {
  //   return <></>;
  // }
};

export default PrefixAdd;