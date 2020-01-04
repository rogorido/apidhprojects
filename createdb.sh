#!/bin/bash

DB=dhprojects

dropdb ${DB}
createdb ${DB}

psql -d ${DB} -f sqls/mainsql.sql

node ./populatedb.js

psql -d ${DB} -c 'REFRESH MATERIALIZED VIEW searching;';
psql -d ${DB} -c 'GRANT SELECT ON ALL TABLES IN SCHEMA public TO dhp_select;'
