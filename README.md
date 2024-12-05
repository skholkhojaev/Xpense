





Xpense

Module 335 – E Mobile-Applikation realisieren






Sino Kholkhojaev
05.12.2024 
Projektbeschreibung
Die Personal Finance Management App ist eine Anwendung zur Verwaltung persönlicher Finanzen. Sie ermöglicht es den Benutzern, Einnahmen und Ausgaben zu verfolgen und ein besseres Verständnis ihrer finanziellen Situation zu entwickeln.
Hauptfunktionen:
1.	Übersicht:
o	Darstellung von Finanzübersichten mithilfe von Diagrammen (z. B. Kreis- und Balkendiagramme).
2.	Transaktionen:
o	Hinzufügen, Anzeigen und Bearbeiten von Transaktionen.
3.	Einstellungen:
o	Verwaltung von Budgets und Kategorien.
4.	Integration mit Supabase:
o	Speicherung von Transaktionen, Kategorien und Budgets in der Cloud.
5.	Geräte-Schnittstellen:
o	Benachrichtigungen: Warnung bei Überschreiten von Budgetgrenzen.
o	Lokale Speicherung: Offline-Speicherung von Transaktionen.
o	Geolokalisierung: Verknüpfung von Ausgaben mit Standorten.
6.	Zusätzlich:
o	Umschaltung zwischen Licht- und Dunkelmodus.
User Stories
•	Als Benutzer möchte ich eine Übersicht über meine Finanzen, um meine Ausgaben und Einnahmen schnell analysieren zu können.
•	Als Benutzer möchte ich Transaktionen hinzufügen, bearbeiten und anzeigen, um meine Finanzdaten zu verwalten.
•	Als Benutzer möchte ich Benachrichtigungen erhalten, wenn mein Budget überschritten wird, um die Kontrolle über meine Finanzen zu behalten.
•	Als Benutzer möchte ich die App auch offline nutzen können, um jederzeit Transaktionen hinzuzufügen.
Storyboard mit UI-Elementen (Skizze)
1.	Dashboard (Startseite):.
o	Balkendiagramme für monatliche Einnahmen und Ausgaben.
o	Alle Transaktionen von dieses Monat
2.	Detailliertes Transaktion:
o	Detail von den Transaktion
o	Geo Lokation von wo den Transaktion gemacht wurde
3.	Einstellungen:
o	Eingabefelder für Budgets und Kategorien.
o	Dunkelmodus-Schalter.
o	Notifikation Setting
(Skizzen hier hinzufügen oder verlinken.)

Datenbank-Modell
•	Tabelle: Transactions
o	ID (Primary Key)
o	Betrag (FLOAT)
o	Kategorie (VARCHAR)
o	Datum (DATE)
o	Standort (Geodäten, optional)
o	Benutzer-ID (Foreign Key)
•	Tabelle: categories
o	ID (Primary Key)
o	Name (VARCHAR)
o	Beschreibung (TEXT, optional)
•	Tabelle: users
o	ID (Primary Key)
o	Name (VARCHAR)
o	E-Mail (VARCHAR)


https://github.com/siyabonga981/expense-tracker 
https://github.com/odnodn/personal-expense-tracker 
