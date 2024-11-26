import styled from "styled-components";

export const StyledModal = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .layerPop {
    background: #fff;
    border-radius: 8px;
    width: 600px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;

      .modal-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .company-name,
      .job-title {
        font-size: 14px;
        color: #555;
        margin: 5px 0;
      }

      .resume-container {
        width: 100%;
        margin-top: 15px;

        .resume-table {
          width: 100%;
          border-collapse: collapse;

          th {
            background: #f4f4f4;
            padding: 10px;
            text-align: left;
          }

          tbody {
            tr.spaceBetweenRB {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              border-bottom: 1px solid #eaeaea;

              .resume-details {
                flex: 8;
                display: flex;
                flex-direction: column;

                .resumeTitle {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  strong {
                    font-weight: bold;
                  }

                  .edit-link {
                    color: gray;
                    font-size: 12px;
                    text-decoration: none;

                    &:hover {
                      text-decoration: underline;
                    }
                  }
                }

                .resume-info {
                  margin-top: 10px;
                  font-size: 12px;
                  color: #666;

                  div {
                    margin: 5px 0;
                  }
                }
              }

              .select-radio {
                flex: 2;
                text-align: right;

                input[type="radio"] {
                  cursor: pointer;
                }
              }
            }
          }
        }
      }

      .btn-area {
        margin-top: 20px;
        text-align: right;
        width: 100%;

        .btn {
          margin-left: 10px;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;

          &.btn-apply {
            background: #007bff;
            color: white;

            &:hover {
              background: #0056b3;
            }
          }

          &.btn-close {
            background: #ccc;
            color: #333;

            &:hover {
              background: #aaa;
            }
          }
        }
      }
    }
  }
`;
