import * as React from "react";
import * as Constants from "~/common/constants";
import * as Validations from "~/common/validations";

import { css } from "@emotion/react";
import { useState } from "react";

import { ButtonPrimaryFull, ButtonDeleteFull, ButtonDeleteDisabledFull, ButtonCancelFull } from "~/components/system/components/Buttons.js";
import { Input } from "~/components/system/components/Input.js";

const STYLES_TRANSPARENT_BG = css `
  background-color: rgba(0,0,0,0.3);
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999999;
`;

const STYLES_MAIN_MODAL = css `
  width: 380px;
  height: auto;
  background-color: #fff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  padding: 24px;
  text-align: left;
`;

const STYLES_HEADER = css `
  color: #000;
  font-size: 16px;
  font-weight: bold;
  font-family: 'inter-medium', -apple-system, BlinkMacSystemFont, arial, sans-serif;
`;

const STYLES_SUB_HEADER = css `
  color: #8E8E93;
  font-size: 14px;
  margin-top: 16px;
  font-family: 'inter-regular', -apple-system, BlinkMacSystemFont, arial, sans-serif;
`;

const STYLES_INPUT_HEADER = css `
  color: #000;
  font-size: 12px;
  font-weight: bold;
  margin-top: 24px;
  margin-bottom: 8px;
`;

export const DeleteModal = (props) => {
    let header = '';
    let subHeader = '';

    if(props.data.type == 'multi') {
      header = 'Are you sure you want to delete the selected ' + props.data.selected + ' files?';
      subHeader = 'These files will be deleted from all connected collections and your file library. You can’t undo this action.';
    }

    if(props.data.type == 'single') {
      header = 'Are you sure you want to delete the file "' + props.data.filename + '"?';
      subHeader = 'This file will be deleted from all connected collections and your file library. You can’t undo this action.';
    }

    if(props.data.type == 'collection') {
      header = 'Are you sure you want to delete the collection “' + props.data.collection + '”?';
      subHeader = 'This collection will be deleted but all your files will remain in your file library. You can’t undo this action.';
    }

    const _handleDelete = () => {
      props.response(true);
    }

    const _handleCancel = () => {
      props.response(false);
    }

    return (
      <div css={STYLES_TRANSPARENT_BG}>
        <div css={STYLES_MAIN_MODAL}>
          <div>
            <div css={STYLES_HEADER}>{header}</div>
            <div css={STYLES_SUB_HEADER}>{subHeader}</div>
            <ButtonCancelFull onClick={_handleCancel} style={{ margin: '24px 0px 8px' }}>Cancel</ButtonCancelFull>
            <ButtonDeleteFull onClick={_handleDelete}>Delete</ButtonDeleteFull>
          </div>
        </div>
      </div>
    );
};

export const DeleteWithInputModal = (props) => {
    const [isUsernameMatch, setIsUsernameMatch] = useState(false);
    const header = 'Are you sure you want to delete your account @' + props.data.username + '?';
    const subHeader = 'You will lose all your files and collections. You can’t undo this action.';
    const inputHeader = 'Please type your username to confirm';
    const inputPlaceholder = 'username';

    const _handleDelete = () => {
      props.response(true);
    }

    const _handleCancel = () => {
      props.response(false);
    }

    const _handleOnChange = (e) => {
     if(Validations.isUsernameMatch({ input: e.target.value, username: props.data.username })) {
      setIsUsernameMatch(true)
     }else{
      setIsUsernameMatch(false)
     }
    }

    let deleteButton;
    if(isUsernameMatch) {
      deleteButton = <ButtonDeleteFull onClick={_handleDelete}>Delete</ButtonDeleteFull>;
    } else {
      deleteButton = <ButtonDeleteDisabledFull>Delete</ButtonDeleteDisabledFull>;
    }

    return (
      <div css={STYLES_TRANSPARENT_BG}>
        <div css={STYLES_MAIN_MODAL}>
          <div>
            <div css={STYLES_HEADER}>{header}</div>
            <div css={STYLES_SUB_HEADER}>{subHeader}</div>
            <div css={STYLES_INPUT_HEADER}>{inputHeader}</div>
            <Input placeholder={inputPlaceholder} onChange={_handleOnChange} />
            <ButtonCancelFull onClick={_handleCancel} style={{ margin: '16px 0px 8px' }}>Cancel</ButtonCancelFull>
            {deleteButton}
          </div>
        </div>
      </div>
    );
};

export const ConfirmModal = (props) => {
    const header = 'Making this file private will remove it from the following public slates: ' + props.data.username + '. Do you wish to continue?';
    const subHeader = 'Making the file private means it’s not visible to others unless they have the link.';

    const _handleConfirm = () => {
      props.response(true);
    }

    const _handleCancel = () => {
      props.response(false);
    }

    return (
      <div css={STYLES_TRANSPARENT_BG}>
        <div css={STYLES_MAIN_MODAL}>
          <div>
            <div css={STYLES_HEADER}>{header}</div>
            <div css={STYLES_SUB_HEADER}>{subHeader}</div>
            <ButtonCancelFull onClick={_handleCancel} style={{ margin: '16px 0px 8px' }}>Cancel</ButtonCancelFull>
            <ButtonPrimaryFull onClick={_handleConfirm}>Confirm</ButtonPrimaryFull>
          </div>
        </div>
      </div>
    );
};