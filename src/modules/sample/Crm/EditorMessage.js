import {
  Box,
  ButtonGroup,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {useRef} from 'react';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

const EditorMessage = (props) => {
  const [openReviewPop, setopenReviewPop] = React.useState(false);
  const textRef = useRef(null);
  const handleBoldMessage = () => {
    const updatedTextMessage = ` *Text*`;
    console.log(textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      //setTextMessage(newText);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };

  const setEnablePopReview = () => {
    setopenReviewPop(true);
  };

  const tranformMessageReview = (text) => {
    const boldRegex = /\*(.*?)\*/g;
    const italicRegex = /_(.*?)_/g;
    const strikethroughRegex = /~(.*?)~/g;

    const boldText = text.replace(boldRegex, '<b>$1</b>');
    const italicText = boldText.replace(italicRegex, '<i>$1</i>');
    const transformedText = italicText.replace(strikethroughRegex, '<s>$1</s>');

    console.log('Hola desde tranformMessageReview', transformedText);
    return transformedText;
  };
  const transformText = () => {
    console.log('content Hola desde tranforText');
    let updatedContents = '';
    updatedContents += tranformMessageReview(
      props.getValueField('campaignContent').value,
    );
    console.log('Este es el updateContents', updatedContents);
    return <div dangerouslySetInnerHTML={{__html: updatedContents}}></div>;
  };

  const handleCampaignContentChange = (event) => {
    props.changeValueField('campaignContent', event);
  };

  const handleCloseReview = () => {
    setopenReviewPop(false);
  };

  const handleItalicsMessage = () => {
    const updatedTextMessage = ` _Text_`;
    console.log(textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      console.log(
        'posicion text',
        props.getValueField('campaignContent').value,
      );
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };

  const handleStrikethrough = () => {
    const updatedTextMessage = ` ~Text~`;
    console.log(textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      console.log(
        'CampaignContent getvalue',
        props.getValueField('campaignContent').value,
      );
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };

  const handleFullName = () => {
    const updatedTextMessage = ` {{denominationClient}}`;
    console.log(textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };

  const handleNameMessage = () => {
    const updatedTextMessage = ` {{givenName}}`;
    console.log(textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };

  const handlePaternalLastNameMessage = () => {
    const updatedTextMessage = ` {{lastName}}`;
    console.log(textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };

  const handleMaternalLastNameMessage = () => {
    const updatedTextMessage = ` {{secondLastName}}`;
    console.log(textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };
  const handleEmailMessage = () => {
    const updatedTextMessage = ` {{emailClient}}`;
    console.log(textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };
  const handleBirthDateMessage = () => {
    const updatedTextMessage = ` {{birtDay}}`;
    console.log('textRef', textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };
  const handleSpecialistMessage = () => {
    const updatedTextMessage = ` {{specialist}}`;
    console.log('textRef', textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };
  const handleScheduledDateMessage = () => {
    const updatedTextMessage = ` {{scheduledDate}}`;
    console.log('textRef', textRef);
    const textarea = textRef.current;
    console.log(textarea);
    const cursorPosition = textarea.selectionStart;
    if (cursorPosition !== undefined) {
      const currentText = props.getValueField('campaignContent').value;
      const newText =
        currentText.slice(0, cursorPosition) +
        updatedTextMessage +
        currentText.slice(cursorPosition);
      props.changeValueField('campaignContent', newText);
      handleCampaignContentChange(newText);
    }
  };
  return (
    <Grid item xs={12} md={12} sx={{mb: '1rem'}}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '.5rem',
          gap: '.5rem',
        }}
      >
        <ButtonGroup variant='outlined' aria-label='outlined button group'>
          <Button
            variant='contained'
            onClick={handleBoldMessage}
            sx={{fontWeight: 'bold', fontSize: '.8rem'}}
          >
            Negrita
          </Button>
          <Button
            variant='contained'
            onClick={handleItalicsMessage}
            sx={{fontStyle: 'italic', fontSize: '.8rem'}}
          >
            Cursiva
          </Button>
          <Button
            variant='contained'
            onClick={handleStrikethrough}
            sx={{
              textDecoration: 'line-through',
              fontSize: '.8rem',
            }}
          >
            Tachado
          </Button>
          <Button
            variant='outlined'
            onClick={handleFullName}
            sx={{fontSize: '.8rem'}}
          >
            Nombre Completo
          </Button>
          <Button
            variant='outlined'
            onClick={handleNameMessage}
            sx={{fontSize: '.8rem'}}
          >
            Nombre
          </Button>
          <Button
            variant='outlined'
            onClick={handlePaternalLastNameMessage}
            sx={{fontSize: '.8rem'}}
          >
            Apellido Paterno
          </Button>
          <Button
            variant='outlined'
            onClick={handleMaternalLastNameMessage}
            sx={{fontSize: '.8rem'}}
          >
            Apellido Materno
          </Button>
          <Button
            variant='outlined'
            onClick={handleEmailMessage}
            sx={{fontSize: '.8rem'}}
          >
            Correo
          </Button>
          <Button
            variant='outlined'
            onClick={handleBirthDateMessage}
            sx={{fontSize: '.8rem'}}
          >
            Fecha Nacimiento
          </Button>
          <Button
            variant='outlined'
            onClick={handleSpecialistMessage}
            sx={{fontSize: '.8rem'}}
          >
            Especialista
          </Button>
          <Button
            variant='outlined'
            onClick={handleScheduledDateMessage}
            sx={{fontSize: '.8rem'}}
          >
            Fecha Programación
          </Button>
        </ButtonGroup>
      </Box>

      <Grid item xs={12} md={12}>
        <TextField
          label='Contenido del mensaje *'
          name='campaignContent'
          variant='outlined'
          multiline
          rows={4}
          value={props.getValueField('campaignContent').value}
          inputRef={textRef}
          onInput={(event) => {
            handleCampaignContentChange(event.target.value);
          }}
          sx={{width: '100%', my: 2}}
        />
      </Grid>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button
          variant='contained'
          sx={{fontSize: '.7rem'}}
          onClick={setEnablePopReview}
        >
          Previsualizar Mensaje
        </Button>
      </Box>

      <Dialog
        open={openReviewPop}
        onClose={handleCloseReview}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          sx={{
            fontSize: '1.3em',
            background: '#1976d2',
            color: 'white',
            marginBottom: '1rem',
          }}
          id='alert-dialog-title'
        >
          {'MENSAJE'}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {props.getValueField('campaignContent').value ? (
            <>
              <p>{transformText()}</p>
            </>
          ) : null}
          {props.previewImages?.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                mx: 1,
                my: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={image}
                alt='Preview'
                style={{
                  width: 200,
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            startIcon={<SaveAltIcon />}
            sx={{width: '100%'}}
            onClick={handleCloseReview}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

EditorMessage.propTypes = {
  changeValueField: PropTypes.func,
  getValueField: PropTypes.func,
  previewImages: PropTypes.func,
};
export default EditorMessage;
