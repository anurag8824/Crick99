import React from "react";
import { CustomLink } from "../../pages/_layout/elements/custom-link";
import { useNavigate } from "react-router-dom";
import TopBackHeader from "./TopBackHeader";

const ClientTransactions = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid ">
      <div className="ant-row ant-row-center">
        <div className="ant-col ant-col-xs-24 ant-col-lg-24">
          <div className="ant-row">
            <div className="ant-card ant-card-bordered gx-card">
              <div className="ant-card-body">
                <TopBackHeader name="Client Transactions" />
                <div className="gx-px-2 gx-pt-3 gx-bg-flex">
                  <form id="advanced_search" className="row g-3">
                    {/* Client */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_client"
                        className="form-label"
                      >
                        Client <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="advanced_search_client"
                        className="form-control"
                        placeholder="Select User"
                        aria-required="true"
                      />
                    </div>

                    {/* Collection */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_collection"
                        className="form-label"
                      >
                        Collection <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="advanced_search_collection"
                        className="form-control"
                        placeholder="CASH A/C"
                        readOnly
                      />
                    </div>

                    {/* Date */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_date"
                        className="form-label"
                      >
                        Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="advanced_search_date"
                        className="form-control"
                        value="2025-09-12"
                        readOnly
                      />
                    </div>

                    {/* Amount */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_amount"
                        className="form-label"
                      >
                        Amount <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        id="advanced_search_amount"
                        className="form-control"
                        placeholder="Amount"
                      />
                    </div>

                    {/* Payment Type */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_paymentType"
                        className="form-label"
                      >
                        Payment Type <span className="text-danger">*</span>
                      </label>
                      <select
                        id="advanced_search_paymentType"
                        className="form-select"
                        aria-required="true"
                      >
                        <option value="">Select PaymentType</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                      </select>
                    </div>

                    {/* Remark */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_remark"
                        className="form-label"
                      >
                        Remark <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="advanced_search_remark"
                        className="form-control"
                        placeholder="Remark"
                      />
                    </div>

                    {/* Ledger Type */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <label
                        htmlFor="advanced_search_ledgerType"
                        className="form-label"
                      >
                        Ledger Type
                      </label>
                      <select
                        id="advanced_search_ledgerType"
                        className="form-select"
                      >
                        <option value="">All</option>
                        <option value="ledger1">Cricket</option>
                        <option value="ledger2">Casino</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn bg-primary text-white"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTransactions;
