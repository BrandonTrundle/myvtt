/**
 * Author: Brandon Trundle
 * File Name: CharacterSheetWindow.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Opens a new browser window and renders the CharacterSheetForm inside it using React Portal.
 * Handles submitting character form data back to the backend API,
 * syncing styles between main window and popup, and safely managing the popup lifecycle.
 * 
 * Props:
 * - onClose (function): Callback to close the window if user cancels or closes popup manually.
 * - onSaveSuccess (function): Callback invoked after successful character save.
 * - character (object): Optional existing character data to populate the form.
 */

import { useEffect, useRef } from 'react'; // React hooks for side-effects and mutable references
import ReactDOM from 'react-dom/client'; // ReactDOM API for creating portals and mounting into new windows
import CharacterSheetForm from './CharacterSheetForm'; // Form component to render inside the new popup window
import submitCharacterForm from './characterSubmitHandler'; // Utility function to submit character form data to server

/**
 * CharacterSheetWindow Component
 * 
 * Opens a new browser popup window for editing or creating a character.
 * Renders the CharacterSheetForm inside the new window, copies styles,
 * handles form submission, and manages window cleanup when closed.
 * 
 * @param {Function} onClose - Callback when the popup window is manually closed or blocked.
 * @param {Function} onSaveSuccess - Callback when a character is successfully saved.
 * @param {Object} character - Optional character object to prefill the form.
 */
const CharacterSheetWindow = ({ onClose, onSaveSuccess, character }) => {
  const newWindowRef = useRef(null);
  const containerRef = useRef(document.createElement('div'));

/**
 * Helper to safely convert string inputs to numbers, or return undefined if invalid.
 * 
 * @param {any} val - Value to convert
 * @returns {number|undefined}
 */
  const toNumber = (val) => (val !== '' && !isNaN(Number(val)) ? Number(val) : undefined);

/**
 * Handles form submission from the CharacterSheetForm.
 * - Prepares a sanitized payload from formData
 * - Calls the backend submission utility
 * - Posts a success message to the parent window if successful
 * 
 * @param {Event} e - Form submission event
 * @param {string|null} portraitImage - Uploaded portrait image path or null
 * @param {Object} formData - Current form field values
 */
  const handleSubmit = async (e, portraitImage, formData) => {
    e.preventDefault();

    const confirmed = newWindowRef.current.confirm("Are you finished with your character?");
    if (!confirmed) {
      console.log("🛑 Save canceled by user.");
      return;
    }

    const payload = {
      age: formData.age || '',
      height: formData.height || '',
      weight: formData.weight || '',
      eyes: formData.eyes || '',
      skin: formData.skin || '',
      hair: formData.hair || '',
      orgName: formData.orgName || '',
      orgSymbolImage: formData.orgSymbolImage || '',
      allies: formData.allies || '',
      spells: formData.spells || [],
      spellSlots_1: toNumber(formData.spellSlots_1),
      spellSlots_2: toNumber(formData.spellSlots_2),
      spellSlots_3: toNumber(formData.spellSlots_3),
      spellSlots_4: toNumber(formData.spellSlots_4),
      spellSlots_5: toNumber(formData.spellSlots_5),
      spellSlots_6: toNumber(formData.spellSlots_6),
      spellSlots_7: toNumber(formData.spellSlots_7),
      spellSlots_8: toNumber(formData.spellSlots_8),
      spellSlots_9: toNumber(formData.spellSlots_9),
      spells_0: formData.spells_0 || '',
      spells_1: formData.spells_1 || '',
      spells_2: formData.spells_2 || '',
      spells_3: formData.spells_3 || '',
      spells_4: formData.spells_4 || '',
      spells_5: formData.spells_5 || '',
      spells_6: formData.spells_6 || '',
      spells_7: formData.spells_7 || '',
      spells_8: formData.spells_8 || '',
      spells_9: formData.spells_9 || '',
      charname: formData.charname || '',
      playername: formData.playername || '',
      class: formData.class || '',
      level: toNumber(formData.level),
      race: formData.race || '',
      background: formData.background || '',
      alignment: formData.alignment || '',
      experiencepoints: toNumber(formData.experiencepoints),
      appearance: formData.appearance || '',
      portraitImage: portraitImage || null,
      strscore: toNumber(formData.strscore),
      strmod: toNumber(formData.strmod),
      dexscore: toNumber(formData.dexscore),
      dexmod: toNumber(formData.dexmod),
      conscore: toNumber(formData.conscore),
      conmod: toNumber(formData.conmod),
      intscore: toNumber(formData.intscore),
      intmod: toNumber(formData.intmod),
      wisscore: toNumber(formData.wisscore),
      wismod: toNumber(formData.wismod),
      chascore: toNumber(formData.chascore),
      chamod: toNumber(formData.chamod),
      "strength-save": toNumber(formData["strength-save"]),
      "strength-save-prof": !!formData["strength-save-prof"],
      "dexterity-save": toNumber(formData["dexterity-save"]),
      "dexterity-save-prof": !!formData["dexterity-save-prof"],
      ac: toNumber(formData.ac),
      initiative: toNumber(formData.initiative),
      speed: toNumber(formData.speed),
      maxhp: toNumber(formData.maxhp),
      currenthp: toNumber(formData.currenthp),
      temphp: toNumber(formData.temphp),
      hitdice: formData.hitdice || '',
      "success-0": !!formData["success-0"],
      "success-1": !!formData["success-1"],
      "success-2": !!formData["success-2"],
      "failure-0": !!formData["failure-0"],
      "failure-1": !!formData["failure-1"],
      "failure-2": !!formData["failure-2"],
      attacks: (formData.attacks || []).filter(
        (a) => a.name || a.atk || a.damage || a.type
      ),
      "attack-notes": formData["attack-notes"] || '',
      skills: formData.skills || [],
      inspiration: toNumber(formData.inspiration),
      proficiencybonus: toNumber(formData.proficiencybonus),
      spellcastingClass: formData.spellcastingClass || '',
      spellcastingAbility: formData.spellcastingAbility || '',
      spellSaveDC: toNumber(formData.spellSaveDC),
      spellAttackBonus: toNumber(formData.spellAttackBonus),
      equipment: formData.equipment || [],
      coins: formData.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
      treasure: formData.treasure || [],
      personalityTraits: formData.personalityTraits || '',
      ideals: formData.ideals || '',
      bonds: formData.bonds || '',
      flaws: formData.flaws || '',
      features: formData.features || '',
      additionalFeatures: formData.additionalFeatures || '',
      passiveWisdom: toNumber(formData.passiveWisdom),
      otherProficiencies: formData.otherProficiencies || '',
      system: formData.system || '5E',
      backstory: formData.backstory || '',
      isPublic: formData.isPublic || false,
    };

    console.log("🧪 Final payload to submit:", payload);

    try {
      await submitCharacterForm(payload, onSaveSuccess, character?._id || null);

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'CHARACTER_SAVED' }, '*');
      }

      // IMPORTANT: Only close if parent confirms it
      // Otherwise let the parent refresh and close things properly
    } catch (err) {
      console.error('❌ Error saving character:', err);
      alert('Failed to save character. Please try again.');
    }
  };

/**
 * Effect that:
 * - Opens a new browser popup window
 * - Injects the CharacterSheetForm React app into the popup
 * - Copies stylesheets and inline styles from the parent window
 * - Periodically checks if the popup was closed
 * - Cleans up by clearing interval and closing popup on unmount
 */ 
  useEffect(() => {
    newWindowRef.current = window.open(
      '',
      'CharacterSheet',
      'width=1100,height=850,left=200,top=100,resizable,scrollbars=yes'
    );

    if (!newWindowRef.current) {
      console.warn('Popup blocked or failed to open.');
      onClose();
      return;
    }

    const newWin = newWindowRef.current;
    newWin.document.title = 'Character Sheet';
    newWin.document.body.style.margin = '0';
    newWin.document.body.style.backgroundColor = '#fdf6e3';
    newWin.document.body.appendChild(containerRef.current);

    const meta = newWin.document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    newWin.document.head.appendChild(meta);

    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const clone = link.cloneNode(true);
      newWin.document.head.appendChild(clone);
    });

    document.querySelectorAll('style').forEach((style) => {
      const clone = style.cloneNode(true);
      newWin.document.head.appendChild(clone);
    });

    const localStyle = newWin.document.createElement('link');
    localStyle.rel = 'stylesheet';
    localStyle.href = `${window.location.origin}/character-sheet.css`;
    newWin.document.head.appendChild(localStyle);

    const root = ReactDOM.createRoot(containerRef.current);
    root.render(
      <CharacterSheetForm onSubmit={handleSubmit} character={character} />
    );

    const timer = setInterval(() => {
      if (newWin.closed) {
        clearInterval(timer);
        onClose();
      }
    }, 500);

    return () => {
      clearInterval(timer);
      newWin.close();
    };
  }, [character, onClose, onSaveSuccess]);

  return null;
};

export default CharacterSheetWindow;
