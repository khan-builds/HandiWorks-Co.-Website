// The downloadable preview and the Astro lesson both mount this activity.
(() => {
  const markup = `
    <section class="fl-workbench" aria-label="Interactive finger module lesson">
      <ol class="fl-progress" aria-label="Lesson steps">
        <li><span>1</span> Joint motion</li>
        <li><span>2</span> Safety check</li>
        <li><span>3</span> Button control</li>
      </ol>
      <div class="fl-bench">
        <figure class="fl-figure">
          <figcaption><strong>Finger mechanism</strong><span>Side view</span></figcaption>
          <div class="fl-drawing" role="img" aria-label="Side view of an open mechanical finger">
            <div class="fl-rest-line"></div>
            <div class="fl-mount"></div>
            <div class="fl-link fl-proximal">
              <i></i>
              <div class="fl-link fl-middle">
                <i></i>
                <div class="fl-link fl-tip"><i></i></div>
              </div>
            </div>
          </div>
          <div class="fl-legend" aria-hidden="true">
            <span>Rigid link</span><span>Pivot pin</span><span>Open position</span>
          </div>
          <div class="fl-readouts">
            <div>Position<strong data-pose>Open</strong></div>
            <div>Drive<strong data-drive>Power off</strong></div>
          </div>
        </figure>
        <div class="fl-exercises">
          <section data-panel>
            <h3 tabindex="-1">Bend the finger</h3>
            <p>Move the curl slider. Watch the blue links and the gold pins as the fingertip travels.</p>
            <label class="fl-slider">
              <span>Finger curl <output aria-live="off">0%</output></span>
              <input type="range" min="0" max="100" value="0" aria-label="Finger curl" aria-valuetext="0% curl">
            </label>
            <fieldset data-motion-question>
              <legend>What makes the finger bend?</legend>
              <label><input type="radio" name="finger-motion" value="shorter"> The rigid links get shorter.</label>
              <label><input type="radio" name="finger-motion" value="rotate"> The links turn around the pins.</label>
            </fieldset>
            <p class="fl-feedback" role="status" data-motion-feedback></p>
          </section>
          <section data-panel hidden>
            <h3 tabindex="-1">Check for binding</h3>
            <p>Keep the virtual drive off. Move the finger by hand to check whether its joints travel freely.</p>
            <button type="button" class="fl-tool" data-test>Test by hand</button>
            <fieldset data-safety-question hidden>
              <legend>The middle joint sticks. What do you do next?</legend>
              <label><input type="radio" name="finger-safety" value="power"> Use the motor to push past the tight spot.</label>
              <label><input type="radio" name="finger-safety" value="inspect"> Keep power off and check the pivot fit.</label>
            </fieldset>
            <p class="fl-feedback" role="status" data-safety-feedback></p>
          </section>
          <section data-panel hidden>
            <h3 tabindex="-1">Test the control button</h3>
            <p>The finger starts open. Predict where it will finish after two presses, then press and release the virtual button twice.</p>
            <div class="fl-controller">
              <button type="button" class="fl-tool" data-press>Press virtual button</button>
              <span>Presses <strong data-count>0</strong></span>
            </div>
            <p class="fl-feedback" role="status" data-control-feedback></p>
          </section>
        </div>
      </div>
      <div class="fl-actions">
        <button type="button" class="fl-back" data-back hidden>Back</button>
        <button type="button" class="fl-next" data-next disabled>Continue</button>
      </div>
      <section class="fl-completion" hidden>
        <h3 tabindex="-1">Lesson complete</h3>
        <p>You curled a finger by rotating rigid links around pins, checked a sticking joint with power off, and used two button presses to close and reopen the finger.</p>
        <button type="button" class="fl-tool" data-restart>Restart lesson</button>
      </section>
    </section>`;

  function startLab(host, focusHeading = false) {
    host.innerHTML = markup;
    const find = (selector) => host.querySelector(selector);
    const panels = Array.from(host.querySelectorAll('[data-panel]'));
    const markers = Array.from(host.querySelectorAll('.fl-progress li'));
    const diagram = find('.fl-drawing');
    const slider = find('input[type="range"]');
    const motionFeedback = find('[data-motion-feedback]');
    const safetyQuestion = find('[data-safety-question]');
    const safetyFeedback = find('[data-safety-feedback]');
    const handTest = find('[data-test]');
    const pressButton = find('[data-press]');
    const next = find('[data-next]');
    const back = find('[data-back]');
    let step = 0;
    let explored = false;
    let motionAnswer = '';
    let check = 'untested';
    let presses = 0;

    function draw(curl, animate = false) {
      const fraction = curl / 100;
      diagram.classList.toggle('fl-moving', animate);
      diagram.style.setProperty('--base-angle', (-10 + 30 * fraction) + 'deg');
      diagram.style.setProperty('--middle-angle', (50 * fraction) + 'deg');
      diagram.style.setProperty('--tip-angle', (60 * fraction) + 'deg');
      const pose = curl === 0 ? 'Open' : curl === 100 ? 'Curled' : curl + '% curled';
      find('[data-pose]').textContent = pose;
      const description = curl === 0
        ? 'Three rigid links line up from the base to the fingertip.'
        : 'The links keep their length and turn around the pins, bringing the fingertip toward the base.';
      diagram.setAttribute('aria-label', 'Finger ' + pose.toLowerCase() + '. ' + description);
    }

    function updateProgress() {
      const completed = [explored && motionAnswer === 'rotate', check === 'passed', presses >= 2];
      markers.forEach((marker, index) => {
        marker.toggleAttribute('data-complete', completed[index]);
        if (index === step) marker.setAttribute('aria-current', 'step');
        else marker.removeAttribute('aria-current');
      });
      next.disabled = !completed[step];
    }

    function showStep(index, focus = true) {
      step = index;
      const finished = step === panels.length;
      find('.fl-bench').hidden = finished;
      find('.fl-actions').hidden = finished;
      find('.fl-completion').hidden = !finished;
      panels.forEach((panel, i) => { panel.hidden = i !== step; });
      back.hidden = step === 0;
      next.textContent = step === panels.length - 1 ? 'Finish lesson' : 'Continue';
      find('[data-drive]').textContent = step === 2 ? 'Virtual power on' : 'Power off';
      if (step === 0) draw(Number(slider.value));
      if (step === 1) draw(check === 'passed' ? 100 : check === 'bound' ? 25 : 0);
      if (step === 2) draw(presses % 2 ? 100 : 0);
      updateProgress();
      if (focus) {
        const heading = finished ? find('.fl-completion h3') : panels[step].querySelector('h3');
        heading.focus();
      }
    }

    function respondToMotion() {
      if (motionAnswer === 'rotate') {
        motionFeedback.textContent = explored
          ? 'Yes. Each link keeps its length while the angle at its pin changes.'
          : 'Yes. Now move the slider to see the links turn.';
      } else if (motionAnswer === 'shorter') {
        motionFeedback.textContent = 'Try the slider again. The distance between the ends of each blue link stays the same.';
      }
      updateProgress();
    }

    slider.addEventListener('input', () => {
      const firstMove = !explored;
      explored = true;
      find('.fl-slider output').textContent = slider.value + '%';
      slider.setAttribute('aria-valuetext', slider.value + '% curl');
      draw(Number(slider.value));
      if (firstMove) respondToMotion();
    });
    find('[data-motion-question]').addEventListener('change', (event) => {
      motionAnswer = event.target.value;
      respondToMotion();
    });

    handTest.addEventListener('click', () => {
      if (check === 'adjusted') {
        check = 'passed';
        draw(100, true);
        safetyFeedback.textContent = 'The finger now curls through its full travel by hand. It is ready for the virtual button test.';
        handTest.disabled = true;
        updateProgress();
        next.focus();
        return;
      }
      check = 'bound';
      draw(25, true);
      safetyQuestion.hidden = false;
      safetyFeedback.textContent = 'The finger stopped at a quarter curl. Check the joint before connecting power.';
    });
    safetyQuestion.addEventListener('change', (event) => {
      if (event.target.value === 'inspect') {
        check = 'adjusted';
        draw(0, true);
        safetyQuestion.disabled = true;
        handTest.textContent = 'Retest by hand';
        safetyFeedback.textContent = 'You found a tight pivot and freed it with the drive off. Repeat the hand check to see whether it moves freely.';
        handTest.focus();
      } else {
        safetyFeedback.textContent = 'A motor pushing a jammed link can damage it. Keep the drive off and look for the point that sticks.';
      }
    });

    pressButton.addEventListener('keydown', (event) => {
      if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
    });
    pressButton.addEventListener('click', () => {
      presses += 1;
      const curled = presses % 2 === 1;
      draw(curled ? 100 : 0, true);
      find('[data-count]').textContent = String(presses);
      find('[data-control-feedback]').textContent = curled
        ? 'This press selected the curled target. Release the button and press again to open the finger.'
        : 'Back to open. Each new press toggles the target once. Holding the button keeps the current target.';
      updateProgress();
    });

    back.addEventListener('click', () => showStep(step - 1));
    next.addEventListener('click', () => showStep(step + 1));
    find('[data-restart]').addEventListener('click', () => startLab(host, true));
    showStep(0, focusHeading);
  }

  document.querySelectorAll('[data-finger-lab]').forEach((host) => startLab(host));
})();
