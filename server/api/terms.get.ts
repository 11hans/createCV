import { readFile } from 'fs/promises'
import { resolve } from 'path'
import fs from 'fs'

// Define valid file names as a type
type TermsFileName = 'en-terms.txt' | 'cs-terms.txt';

// Fallback content for when the terms files are not found
const fallbackTerms: Record<TermsFileName, string> = {
  'en-terms.txt': `TERMS OF USE FOR QFAST SOFTWARE (BETA VERSION)

These Terms of Use (“Terms”) govern the relationship between you (“User”) and the provider of QFast software (“Provider”). Please read these Terms carefully before you start using QFast. By installing, running, or otherwise using QFast, you express your agreement with these Terms.

⸻

1. Preliminary Nature (Beta Version)

1.1. Beta Version
QFast is provided as a beta version (“Beta Version”), which means it is a preliminary release intended for testing, trial use, and the collection of User feedback.
1.2. Instability and Changes
Because of its preliminary nature, the Beta Version may contain errors, defects, unstable features, and other technical issues. The User acknowledges that the Beta Version is not a final product and may undergo substantial changes during the testing period.

⸻

2. Providing Feedback

2.1. Voluntary Feedback
Users are invited to provide voluntary feedback, error reports, and suggestions for improvements (“Feedback”).
2.2. Use of Feedback
The Provider may use such Feedback to develop and improve the software, without any entitlement of the User to remuneration or other compensation.

⸻

3. Limitation of Liability

3.1. No Warranty
To the fullest extent permitted by applicable law, the Beta Version of QFast is provided “as is” without any express or implied warranty. The Provider makes no warranties regarding its functionality, completeness, reliability, or suitability for any particular purpose.
3.2. Limitation of Liability
The Provider shall not be liable for any direct or indirect damages, data loss, lost profits, or any other damages or harm arising in connection with the use or inability to use the Beta Version, including cases where the Provider has been notified of the possibility of such damages.
3.3. Disclaimer for Data
The User is fully responsible for all data stored, processed, or otherwise managed using the Beta Version, including data backups. The Provider is not liable for any loss, damage, or misuse of the User's data.

⸻

4. Updates and Modifications

4.1. Software Updates
The Beta Version may be updated, modified, or changed at any time (e.g., by adding new features or fixing bugs) without prior notice to the User.
4.2. Termination of Beta Version
The Provider reserves the right to terminate or suspend the availability of the Beta Version at any time, even without stating a reason.

⸻

5. Intellectual Property

5.1. Ownership Rights
All intellectual property rights in QFast, including the Beta Version, its name, logo, source code, design, and related materials, belong to the Provider or its licensors.
5.2. Usage Restrictions
By using the Beta Version, the User does not acquire any ownership rights to the Beta Version or to any individual components of QFast. The User undertakes not to perform reverse engineering, decompilation, or any other unauthorized use of the software unless permitted by mandatory legal regulations.

⸻

6. Privacy and Personal Data Protection

6.1. Processing of Personal Data
	•	The use of the Beta Version of QFast may require the processing of Users' personal data (“Personal Data”).
	•	The Provider processes Personal Data in compliance with applicable data protection laws and in accordance with its Privacy Policy (“Policy”).

6.2. Scope and Purpose of Processing
	•	Personal Data is processed only to the extent necessary to ensure the operation, functionality, and further development of the Beta Version.
	•	The purpose of processing Personal Data includes, but is not limited to:
	•	Ensuring the proper functioning of the software (e.g., verifying authorization, managing user accounts);
	•	Providing technical support (e.g., responding to inquiries and error reports);
	•	Improving and customizing the software's functionality based on feedback;
	•	Fulfilling legal obligations that may apply to the Provider.

6.3. Privacy Policy
	•	Detailed information on what Personal Data is collected, how it is processed, stored, and protected is contained in the Policy, which is available at [insert link / location].
	•	The User is required to review this Policy before beginning to use the software.

6.4. Users' Rights
	•	Users have, among others, the following rights regarding the processing of their Personal Data:
	•	Right of Access: to request information about whether and how their Personal Data is processed;
	•	Right to Rectification: to request correction of inaccurate or incomplete Personal Data;
	•	Right to Erasure (“Right to be Forgotten”): in certain circumstances, to request the deletion of Personal Data;
	•	Right to Restrict Processing: in certain circumstances, to request restrictions on the processing of their Personal Data;
	•	Right to Data Portability: to receive their Personal Data in a structured, commonly used, and machine-readable format, and to potentially transfer it to another controller;
	•	Right to Object: to object at any time to the processing of Personal Data for direct marketing purposes or based on legitimate interest.

6.5. Data Retention and Security
	•	The Provider implements appropriate technical and organizational measures to protect Personal Data against loss, misuse, unauthorized access, disclosure, or alteration.
	•	Personal Data is retained only for as long as necessary or as required by applicable legal regulations.

6.6. Changes to Privacy Practices
	•	The Provider reserves the right to modify the Policy in the event of changes to relevant regulations or the needs of the software. The User will be informed of any substantial changes in an appropriate manner (e.g., by email or via a notification within the software).
	•	By continuing to use the software after the changes take effect, the User confirms acceptance of such changes.

⸻

7. Acknowledgment and Support

7.1. Acknowledgment
Thank you for using the QFast Beta Version and helping us improve it. Your Feedback is of great value to us.
7.2. Contact
For any questions, issues, or suggestions, you can reach us at: support@qfast.co.

⸻

8. Changes to the Terms

8.1. Right to Change
The Provider reserves the right to change or amend these Terms at any time. You will be notified of any changes in an appropriate manner (e.g., by email or by posting updates on the website).
8.2. Acceptance of Changes
If you continue to use the Beta Version after the updated Terms take effect, you will be deemed to have unconditionally agreed to such changes.

⸻

9. Governing Law and Dispute Resolution

9.1. Governing Law
These Terms shall be governed by and construed in accordance with the laws of the Czech Republic.
9.2. Dispute Resolution
All disputes arising out of or in connection with these Terms shall first be attempted to be resolved amicably between the Parties (the User and the Provider). If an amicable resolution cannot be reached, the dispute shall be decided by the competent courts of the Czech Republic.

⸻

10. Final Provisions

10.1. Invalidity of Provisions
If any provision of these Terms is found to be invalid or unenforceable, such invalidity or unenforceability shall not affect the validity of the remaining provisions. The invalid or unenforceable provision shall be replaced by a provision that most closely reflects the intended purpose of the original provision.
10.2. Entire Agreement
These Terms represent the entire agreement between the User and the Provider regarding the Beta Version and supersede all prior oral or written agreements or arrangements.
10.3. Consent to the Terms
By using the QFast Beta Version, you agree to be bound by these Terms in their entirety.

⸻

Thank you for reading these Terms of Use. We wish you a pleasant experience with the QFast Beta Version. If you have any questions or comments, please contact us at support@qfast.co.
`,

  'cs-terms.txt': `PODMÍNKY POUŽITÍ SOFTWARU QFAST (BETA VERZE)

Tyto Podmínky použití („Podmínky") upravují vztah mezi vámi („Uživatel") a poskytovatelem softwaru QFast („Poskytovatel"). Před započetím používání softwaru QFast si prosím pečlivě přečtěte níže uvedené Podmínky. Instalací, spuštěním nebo jiným způsobem používání softwaru QFast vyjadřujete svůj souhlas s těmito Podmínkami.

⸻

1. Předběžný charakter (beta verze)

1.1. Beta verze
Software QFast je poskytován jako beta verze („Beta verze"), což znamená, že se jedná o předběžné vydání určené ke zkoušení, testování a sběru zpětné vazby od Uživatelů.
1.2. Nestabilita a změny
V důsledku předběžného charakteru může Beta verze obsahovat chyby, nedostatky, nestabilní funkce a další technické problémy. Uživatel bere na vědomí, že Beta verze není finálním produktem a může se v průběhu testovacího období výrazně změnit.

⸻

2. Poskytování zpětné vazby

2.1. Dobrovolná zpětná vazba
Uživatelé jsou vyzýváni k poskytování dobrovolné zpětné vazby, hlášení chyb a návrhů na zlepšení („Zpětná vazba").
2.2. Využití Zpětné vazby
Poskytovatel může Zpětnou vazbu využít pro vývoj a vylepšování softwaru, a to bez jakéhokoli nároku Uživatele na odměnu či jiné protiplnění.

⸻

3. Omezení odpovědnosti

3.1. Bez záruky
V maximálním rozsahu povoleném platnými právními předpisy je Beta verze softwaru QFast poskytována „tak, jak je" a bez jakékoli výslovné či předpokládané záruky. Poskytovatel neposkytuje žádné záruky ohledně funkčnosti, úplnosti, spolehlivosti či vhodnosti pro konkrétní účel.
3.2. Omezení odpovědnosti
Poskytovatel nenese odpovědnost za jakoukoli přímou či nepřímou škodu, ztrátu dat, ušlý zisk nebo jakoukoli jinou škodu či újmu vzniklou Uživateli či třetím osobám v souvislosti s používáním nebo nemožností používání Beta verze, a to včetně případů, kdy byl Poskytovatel na možnost vzniku takové škody upozorněn.
3.3. Vyloučení odpovědnosti za data
Uživatel je plně odpovědný za veškerá data ukládaná, zpracovávaná či jinak spravovaná pomocí Beta verze a za jejich zálohování. Poskytovatel neručí za ztrátu, poškození nebo zneužití dat Uživatele.

⸻

4. Aktualizace a změny

4.1. Aktualizace softwaru
Beta verze může být kdykoli aktualizována, upravena či změněna (například přidáním nových funkcí nebo opravou chyb) bez předchozího upozornění Uživatele.
4.2. Ukončení Beta verze
Poskytovatel si vyhrazuje právo kdykoli ukončit nebo pozastavit dostupnost Beta verze, a to i bez uvedení důvodu.

⸻

5. Duševní vlastnictví

5.1. Vlastnická práva
Veškerá práva duševního vlastnictví k softwaru QFast, včetně Beta verze, jeho názvu, loga, zdrojového kódu, designu a souvisejících materiálů, náleží Poskytovateli či jeho licenčním partnerům.
5.2. Omezení užití
Uživatel tímto nezískává žádná vlastnická práva k Beta verzi ani k jednotlivým prvkům softwaru QFast. Uživatel se zavazuje neprovádět zpětnou analýzu, dekompilaci či jinou formu nepovoleného užití softwaru, pokud to není umožněno kogentními právními předpisy.

⸻

6. Ochrana soukromí a osobních údajů

6.1. Zpracování osobních údajů
	•	Používání Beta verze softwaru QFast může vyžadovat zpracování osobních údajů uživatelů (dále jen "osobní údaje").
	•	Poskytovatel zpracovává osobní údaje v souladu s platnými právními předpisy na ochranu osobních údajů a se svou Zásadou ochrany osobních údajů (dále jen "Zásada").

6.2. Rozsah a účel zpracování
	•	Osobní údaje jsou zpracovávány pouze v rozsahu nezbytném pro zajištění provozu, funkčnosti a dalšího vývoje Beta verze softwaru.
	•	Účel zpracování osobních údajů zahrnuje zejména:
	•	Umožnění řádné funkce softwaru (např. ověření oprávnění, správa uživatelských účtů);
	•	Zajištění technické podpory (např. reakce na dotazy a hlášení chyb);
	•	Zlepšování a přizpůsobení funkčnosti softwaru na základě zpětné vazby;
	•	Plnění zákonných povinností, pokud se na Poskytovatele vztahují.

6.3. Zásada ochrany osobních údajů
	•	Podrobné informace o tom, jaké osobní údaje jsou shromažďovány, jak jsou zpracovávány, uchovávány a chráněny, jsou obsaženy v Zásadě, která je dostupná [vložte odkaz / umístění].
	•	Uživatel je povinen se s touto Zásadou seznámit ještě před zahájením užívání softwaru.

6.4. Práva uživatelů
	•	Uživatelé mají v souvislosti se zpracováním svých osobních údajů zejména tato práva:
	•	Právo na přístup: požadovat informace o tom, zda a jak jsou jejich osobní údaje zpracovávány;
	•	Právo na opravu: požadovat opravu nepřesných nebo neúplných osobních údajů;
	•	**Právo na výmaz (""právo být zapomenut") **: za určitých podmínek požadovat vymazání osobních údajů;
	•	Právo na omezení zpracování: za určitých podmínek požadovat omezení zpracování svých osobních údajů;
	•	Právo na přenositelnost: obdržet osobní údaje ve strukturovaném, běžně používaném a strojově čitelném formátu a případně je předat jinému správci;
	•	Právo vznést námitku: kdykoli vznést námitku proti zpracování osobních údajů pro účely přímého marketingu nebo z důvodu oprávněného zájmu.

6.5. Uchovávání dat a bezpečnost
	•	Poskytovatel zavádí přiměřená technická a organizační opatření k ochraně osobních údajů proti ztrátě, zneužití, neoprávněnému přístupu, zveřejnění nebo úpravám.
	•	Osobní údaje jsou uchovávány pouze po nezbytně dlouhou dobu, případně po dobu vyžadovanou příslušnými právními předpisy.

6.6. Změny v ochraně osobních údajů
	•	Poskytovatel si vyhrazuje právo upravovat Zásadu v případě změn relevantních předpisů či potřeb softwaru. O podstatných změnách bude Uživatel informován vhodným způsobem (např. e-mailem nebo oznámením v softwaru).
	•	Pokračováním v používání softwaru po účinnosti změn Uživatel potvrzuje, že se změnou souhlasí.

⸻

7. Poděkování a podpora

7.1. Poděkování
Děkujeme, že používáte Beta verzi softwaru QFast a pomáháte nám jej vylepšovat. Vaše Zpětná vazba je pro nás velmi cenná.
7.2. Kontakt
V případě jakýchkoli dotazů, problémů nebo podnětů nás můžete kontaktovat na e-mailu: support@qfast.co.

⸻

8. Změny Podmínek

8.1. Právo na změnu
Poskytovatel si vyhrazuje právo kdykoli změnit či doplnit tyto Podmínky. O změně Podmínek budete informováni vhodným způsobem (např. e-mailem nebo uveřejněním aktualizace na internetových stránkách).
8.2. Souhlas se změnami
Pokud budete pokračovat v používání Beta verze po nabytí účinnosti změněných Podmínek, má se za to, že s těmito změnami bezvýhradně souhlasíte.

⸻

9. Rozhodné právo a řešení sporů

9.1. Rozhodné právo
Tyto Podmínky se řídí a vykládají v souladu s platnými právními předpisy České republiky.
9.2. Řešení sporů
Veškeré spory vzniklé v souvislosti s těmito Podmínkami se Strany (Uživatel a Poskytovatel) pokusí vyřešit smírnou cestou. Pokud se nepodaří dosáhnout smírného řešení, bude spor rozhodován příslušným soudem České republiky.

⸻

10. Závěrečná ustanovení

10.1. Neplatnost ustanovení
Pokud by se některé ustanovení těchto Podmínek ukázalo být neplatným nebo nevymahatelným, nemá tato neplatnost nebo nevymahatelnost vliv na platnost ostatních ustanovení. Neplatné či nevymahatelné ustanovení se nahradí ustanovením, které je co nejblíže zamýšlenému účelu původního ustanovení.
10.2. Úplnost dohody
Tyto Podmínky představují úplnou dohodu mezi Uživatelem a Poskytovatelem ohledně Beta verze a nahrazují veškeré předchozí ústní či písemné dohody či ujednání.
10.3. Souhlas s Podmínkami
Používáním Beta verze softwaru QFast vyjadřujete souhlas s těmito Podmínkami v plném rozsahu.

⸻

Děkujeme, že jste si přečetli tyto Podmínky použití a přejeme vám příjemné užívání beta verze softwaru QFast. V případě jakýchkoli dotazů či připomínek nás neváhejte kontaktovat na support@qfast.co.
`
};

const log = (...args: any[]) => {
  console.log(`[${new Date().toISOString()}] Terms API:`, ...args)
}

const logError = (...args: any[]) => {
  console.error(`[${new Date().toISOString()}] Terms API ERROR:`, ...args)
}

export default defineEventHandler(async (event) => {
  log('Request received')
  
  try {
    // Check the host to decide the language
    const rawHost = event.node.req.headers.host || ''
    const host = rawHost.split(':')[0] // Remove port if present
    log(`Host check - Raw: "${rawHost}", Cleaned: "${host}"`)
    
    let content = fallbackTerms['en-terms.txt']
    
    if (host.endsWith('.cz')) {
      log('Detected .cz domain - serving Czech terms')
      content = fallbackTerms['cs-terms.txt']
    } else {
      log('Defaulting to English terms')
    }

    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return content
  } catch (error: any) {
    logError(`Failed to serve terms: ${error.message}`)
    logError('Stack trace:', error.stack)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to load terms file'
    })
  }
}) 