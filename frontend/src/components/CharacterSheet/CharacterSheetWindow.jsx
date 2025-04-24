// CharacterSheetWindow.jsx

import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import CharacterSheetForm from './CharacterSheetForm';
import submitCharacterForm from '../../utils/characterSubmitHandler';

const CharacterSheetWindow = ({ onClose, onSaveSuccess, character }) => {
  const newWindowRef = useRef(null);
  const containerRef = useRef(document.createElement('div'));

  const toNumber = (val) => (val !== '' && !isNaN(Number(val)) ? Number(val) : undefined);

  const handleSubmit = async (e, portraitImage, formData) => {
    e.preventDefault();

    const payload = {
      name: formData.charname || '',
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
    await submitCharacterForm(payload, onSaveSuccess);
  };

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
