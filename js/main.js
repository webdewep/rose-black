    gsap.registerPlugin(ScrollTrigger);

    // Параллакс роз
    const roses = gsap.utils.toArray('.rose-float');
    roses.forEach((rose, i) => {
      const speed = (i % 3 + 1) * 120;
      const rotationDir = i % 2 === 0 ? 180 : -180;

      gsap.to(rose, {
        y: `-=${speed}`,
        rotation: rotationDir,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5
        }
      });
    });

    // Логика формы: присутствие, доп. поля, пара
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const optionalFields = document.getElementById('optional-fields');
    const partnerField = document.getElementById('partner-field');
    const partnerInput = partnerField ? partnerField.querySelector('input[name="partner_name"]') : null;

    function clearOptionalFields() {
      if (!optionalFields) return;

      const textInputs = optionalFields.querySelectorAll('input[type="text"]');
      textInputs.forEach(input => {
        input.value = '';
        input.removeAttribute('required');
      });

      const checkboxes = optionalFields.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
    }

    attendanceRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const value = e.target.value;

        if (value === 'no') {
          // Скрываем доп. поля
          gsap.to(optionalFields, {
            opacity: 0,
            height: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              optionalFields.classList.add('hidden');
              clearOptionalFields();
              if (partnerField && partnerInput) {
                partnerField.classList.remove('hidden');
                partnerInput.removeAttribute('required');
                partnerInput.value = '';
              }
            }
          });
        } else {
          // Показываем блок optional-fields
          optionalFields.classList.remove('hidden');
          gsap.set(optionalFields, { height: "auto" });
          const targetHeight = optionalFields.offsetHeight;
          gsap.set(optionalFields, { height: 0 });

          gsap.to(optionalFields, {
            opacity: 1,
            height: targetHeight,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(optionalFields, { height: "auto" });
            }
          });

          // Логика поля пары
          if (partnerField && partnerInput) {
            if (value === 'with_partner') {
              partnerField.classList.remove('hidden');
              partnerInput.setAttribute('required', 'required');
            } else {
              partnerField.classList.add('hidden');
              partnerInput.value = '';
              partnerInput.removeAttribute('required');
            }
          }
        }
      });
    });

    // ТАЙМЕР (Москва, UTC+3)
    const weddingDateString = "2026-09-14T16:00:00+03:00";
    const weddingDate = new Date(weddingDateString).getTime();

    function updateCountdown() {
      const now = Date.now();
      const distance = weddingDate - now;

      if (distance < 0) {
        document.getElementById("countdown-container").innerHTML = `
          <div class="font-serif text-2xl gold-text uppercase tracking-widest">
            Этот день уже с нами, спасибо, что были рядом
          </div>
        `;
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").innerText    = String(days).padStart(2, '0');
      document.getElementById("hours").innerText   = String(hours).padStart(2, '0');
      document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
      document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
